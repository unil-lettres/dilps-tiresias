<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Application\TextFormat;
use Doctrine\DBAL\ArrayParameterType;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use Ecodev\Felix\Api\Exception;
use GraphQL\Doctrine\Definition\Operator\AbstractOperator;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\LeafType;
use ReflectionClass;

abstract class AbstractSearchOperatorType extends AbstractOperator
{
    /**
     * Words that InnoDB does not index, from `information_schema.INNODB_FT_DEFAULT_STOPWORD`.
     */
    private const array STOPWORDS = ['a', 'about', 'an', 'are', 'as', 'at', 'be', 'by', 'com', 'de', 'en', 'for', 'from', 'how', 'i', 'in', 'is', 'it', 'la', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'was', 'what', 'when', 'where', 'who', 'will', 'with', 'und', 'www'];

    /**
     * Map a joined alias to the corresponding metadata entity.
     *
     * @var array<string, ClassMetadata>
     */
    protected $mapAliasToMetadata = [];

    protected function getConfiguration(LeafType $leafType): array
    {
        return [
            'fields' => [
                [
                    'name' => 'value',
                    'type' => self::nonNull($leafType),
                ],
            ],
        ];
    }

    public function getDqlCondition(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias, string $field, ?array $args): string
    {
        if (!$args) {
            return '';
        }

        $textFormat = new TextFormat($args['value']);
        $exactTerms = $textFormat->exactTerms();
        $notExactTerms = $textFormat->notExactTerms();

        if (!$exactTerms && !$notExactTerms) {
            return '';
        }

        $fields = $this->getSearchableFields($metadata, $alias);
        $joinedSearches = $this->getJoinedSearches($uniqueNameFactory, $metadata, $queryBuilder, $alias);

        return $this->buildSearchDqlCondition($uniqueNameFactory, $metadata, $queryBuilder, $fields, $notExactTerms, $exactTerms, $joinedSearches);
    }

    abstract protected function getSearchableFieldsWhitelist(ClassMetadata $metadata): array;

    protected function getSearchableFields(ClassMetadata $metadata, string $alias): array
    {
        $this->mapAliasToMetadata[$alias] = $metadata;

        $whitelistedFields = $this->getSearchableFieldsWhitelist($metadata);

        // Find most textual fields for the entity
        $fields = [];
        foreach ($metadata->fieldMappings as $mapping) {
            if (in_array($mapping->fieldName, $whitelistedFields, true)) {
                $fieldName = $mapping->fieldName;
                $field = $alias . '.' . $fieldName;
                $fields[] = $this->fieldToDql($metadata->getReflectionClass(), $fieldName, $field);
            }
        }

        return $fields;
    }

    /**
     * Optionally wrap the `$fieldAlias` in a custom DQL function. Typically useful to search correctly in i18n fields.
     */
    protected function fieldToDql(ReflectionClass $className, string $fieldName, string $fieldAlias): string
    {
        return $fieldAlias;
    }

    /**
     * Map one class to one joined entity that is searchable.
     *
     * This list should be kept as small as possible
     *
     * @return string[][]
     */
    abstract protected function getSearchableJoinedEntities(): array;

    /**
     * Return how to search on the joined entities.
     *
     * This should be avoided if possible to instead only search in the original entity itself.
     *
     * @return JoinedSearch[]
     */
    private function getJoinedSearches(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias): array
    {
        $result = [];
        foreach ($this->getSearchableJoinedEntities() as $class => $fieldNames) {
            if (is_a($metadata->getName(), $class, true)) {
                foreach ($fieldNames as $fieldName) {
                    $association = $metadata->getAssociationMapping($fieldName);
                    $joinedMetadata = $queryBuilder->getEntityManager()->getClassMetadata($association->targetEntity);
                    $joinedAlias = $uniqueNameFactory->createAliasName($association->targetEntity);

                    $result[] = new JoinedSearch(
                        $alias . '.' . $fieldName,
                        $association->isToMany(),
                        $joinedMetadata,
                        $joinedAlias,
                        $this->getSearchableFields($joinedMetadata, $joinedAlias),
                    );
                }
            }
        }

        return $result;
    }

    /**
     * Return a DQL condition matching the joined entities that contain the words, or null if none does.
     *
     * The matching joined entities are found first, by a separate query, because a join with them would prevent
     * MariaDB from using the fulltext indexes, and would multiply the rows by the number of joined entities.
     */
    private function getJoinedCondition(UniqueNameFactory $uniqueNameFactory, QueryBuilder $queryBuilder, JoinedSearch $joinedSearch, array $words, array $exactTerms): ?string
    {
        $joinedQueryBuilder = $queryBuilder->getEntityManager()->createQueryBuilder()
            ->select($joinedSearch->alias . '.id')
            ->from($joinedSearch->metadata->getName(), $joinedSearch->alias);

        $condition = $this->buildSearchDqlCondition($uniqueNameFactory, $joinedSearch->metadata, $joinedQueryBuilder, $joinedSearch->fields, $words, $exactTerms);
        $ids = $joinedQueryBuilder->where($condition)->getQuery()->getSingleColumnResult();
        if (!$ids) {
            return null;
        }

        $parameterName = $uniqueNameFactory->createParameterName();
        $queryBuilder->setParameter($parameterName, $ids, ArrayParameterType::INTEGER);

        if ($joinedSearch->isToMany) {
            return ":$parameterName MEMBER OF $joinedSearch->path";
        }

        return "IDENTITY($joinedSearch->path) IN (:$parameterName)";
    }

    /**
     * Return a DQL condition to search each of the words in any of the fields.
     */
    /**
     * @param JoinedSearch[] $joinedSearches
     */
    protected function buildSearchDqlCondition(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, array $fields, array $words, array $exactTerms, array $joinedSearches = []): string
    {
        if (!$fields) {
            throw new Exception('Cannot find fields to search on for entity ' . $metadata->name);
        }

        // Keep a list of fields that cannot be used for fulltext search.
        $fieldsFullTextNotUsed = $fields;

        // Split fields by table.
        $fieldsByTable = [];
        foreach ($fields as $field) {
            $parts = explode('.', $field);
            $table = $parts[0];
            $fieldName = $parts[1];
            if (!isset($fieldsByTable[$table])) {
                $fieldsByTable[$table] = [];
            }
            $fieldsByTable[$table][] = $fieldName;
        }

        // Search if a table has a fulltext index available for the specified columns.
        // It searches in the Doctrine metadata and not in the database schema.
        $fullTextIndexes = [];
        $tableIds = [];
        foreach ($fieldsByTable as $table => $tableFields) {
            $metadataClass = $this->mapAliasToMetadata[$table];

            // Find an index flagged as fulltext.
            foreach ($metadataClass->table['indexes'] as $index) {
                if (in_array('fulltext', $index['flags'] ?? [], true)) {
                    // Check that all table fields are in the index columns.
                    $fieldsInIndex = array_intersect($tableFields, $index['fields']);

                    if (count($fieldsInIndex) === count($index['fields'])) {
                        // All fields are in the index, we can use it.

                        $fullFieldsInIndex = array_map(fn ($field) => "$table.$field", $fieldsInIndex);
                        $strFieldsInIndex = implode(',', $fullFieldsInIndex);

                        $fullTextIndexes[] = $strFieldsInIndex;

                        // Remove fields used in fulltext search from fields list.
                        $fieldsFullTextNotUsed = array_diff($fieldsFullTextNotUsed, $fullFieldsInIndex);
                    }
                }
            }

            if (in_array('id', $tableFields, true)) {
                $tableIds[] = "$table.id";
            }
        }

        // Remove id field. It will be searched separately.
        $fields = array_diff($fields, $tableIds);
        $fieldsFullTextNotUsed = array_diff($fieldsFullTextNotUsed, $tableIds);

        // Split words by spaces that replaced fulltext special char.
        // Ex. Notre-Dame becomes two words: Notre and Dame, and Notre- becomes only Notre.
        $words = array_filter(
            array_merge(
                ...array_map(
                    fn ($word) => explode(' ', $this->cleanFullTextSpecialChars($word)),
                    $words,
                ),
            ),
            fn ($word) => $word !== '',
        );

        // Fulltext conditions are cheaper, so they come first to evaluate LIKE on fewer rows
        $fullTextWheres = [];
        $likeOnlyWheres = [];
        foreach ($words as $word) {
            $orWheres = [];

            $useFullText = $this->isIndexed($word) && count($fullTextIndexes) > 0;
            if ($useFullText) {
                $fieldsForLike = $fieldsFullTextNotUsed;

                $parameterName = $uniqueNameFactory->createParameterName();

                // "+": The word is mandatory in all rows returned.
                // "*": The wildcard, indicating zero or more characters.
                //      It can only appear at the end of a word.
                $queryBuilder->setParameter($parameterName, "+$word*");

                $orWheres = array_merge(
                    $orWheres,
                    array_map(
                        fn ($fullTextIndexe) => " (MATCH ($fullTextIndexe) AGAINST (:$parameterName IN BOOLEAN MODE) > 0) ",
                        $fullTextIndexes,
                    ),
                );
            } else {
                $fieldsForLike = $fields;
            }

            if (!empty($fieldsForLike)) {
                $parameterName = $uniqueNameFactory->createParameterName();
                $queryBuilder->setParameter($parameterName, '%' . $word . '%');

                $orWheres = array_merge(
                    $orWheres,
                    array_map(
                        fn ($field) => "$field LIKE :$parameterName",
                        $fieldsForLike,
                    ),
                );
            }

            // Do not search ID with like, but with index.
            if (is_numeric($word)) {
                $number = (int) $word;

                $orWheres = array_merge(
                    $orWheres,
                    array_map(
                        fn ($tableId) => " $tableId = $number ",
                        $tableIds,
                    ),
                );
            }

            foreach ($joinedSearches as $joinedSearch) {
                $orWheres[] = $this->getJoinedCondition($uniqueNameFactory, $queryBuilder, $joinedSearch, [$word], []);
            }
            $orWheres = array_filter($orWheres);

            if ($useFullText) {
                $fullTextWheres[] = '(' . implode(' OR ', $orWheres) . ')';
            } else {
                $likeOnlyWheres[] = '(' . implode(' OR ', $orWheres) . ')';
            }
        }

        foreach ($exactTerms as $exactTerm) {
            $orWheres = [];

            $cleanedExactTerm = $this->cleanFullTextSpecialChars($exactTerm);
            $indexedWords = array_filter(explode(' ', $cleanedExactTerm), $this->isIndexed(...));
            $useFullText = $indexedWords && count($fullTextIndexes) > 0;
            if ($useFullText) {
                $fieldsForLike = $fieldsFullTextNotUsed;

                $parameterName = $uniqueNameFactory->createParameterName();

                // "+": The word is mandatory in all rows returned.
                $queryBuilder->setParameter($parameterName, "+\"$cleanedExactTerm\"");

                $orWheres = array_merge(
                    $orWheres,
                    array_map(
                        fn ($fullTextIndexe) => " (MATCH ($fullTextIndexe) AGAINST (:$parameterName IN BOOLEAN MODE) > 0) ",
                        $fullTextIndexes,
                    ),
                );
            } else {
                $fieldsForLike = $fields;
            }

            if (!empty($fieldsForLike)) {
                $parameterName = $uniqueNameFactory->createParameterName();

                $queryBuilder->setParameter("{$parameterName}_start", "$exactTerm %");
                $queryBuilder->setParameter("{$parameterName}_middle", "% $exactTerm %");
                $queryBuilder->setParameter("{$parameterName}_end", "% $exactTerm");
                $queryBuilder->setParameter("{$parameterName}_exact", $exactTerm);

                $orWheres = array_merge(
                    $orWheres,
                    ...array_map(
                        fn ($field) => [
                            "$field LIKE :{$parameterName}_start",
                            "$field LIKE :{$parameterName}_middle",
                            "$field LIKE :{$parameterName}_end",
                            "$field = :{$parameterName}_exact",
                        ],
                        $fieldsForLike,
                    ),
                );
            }

            foreach ($joinedSearches as $joinedSearch) {
                $orWheres[] = $this->getJoinedCondition($uniqueNameFactory, $queryBuilder, $joinedSearch, [], [$exactTerm]);
            }
            $orWheres = array_filter($orWheres);

            if ($useFullText) {
                $fullTextWheres[] = '(' . implode(' OR ', $orWheres) . ')';
            } else {
                $likeOnlyWheres[] = '(' . implode(' OR ', $orWheres) . ')';
            }
        }

        return implode(' AND ', [...$fullTextWheres, ...$likeOnlyWheres]);
    }

    /**
     * Whether the word is in the fulltext indexes, otherwise fulltext search cannot find it, and we must use LIKE instead.
     *
     * Fulltext search is configured for minimum 3 characters length.
     */
    private function isIndexed(string $word): bool
    {
        return mb_strlen($word) > 2 && !in_array(mb_strtolower($word), self::STOPWORDS, true);
    }

    /**
     * Replace, with spaces, special characters that have a special meaning in
     * fulltext search boolean mode.
     *
     * If an error is raised when trying to clean the word, the original word
     * is returned. So it will not fail silently.
     */
    protected function cleanFullTextSpecialChars(string $word): string
    {
        $result = mb_ereg_replace('[+\-<>()~*@]', ' ', $word);

        return $result === false || $result === null ? $word : $result;
    }
}
