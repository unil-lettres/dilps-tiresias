<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Application\TextFormat;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;
use Ecodev\Felix\Api\Exception;
use GraphQL\Doctrine\Definition\Operator\AbstractOperator;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\LeafType;
use ReflectionClass;

abstract class AbstractSearchOperatorType extends AbstractOperator
{
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

    public function getDqlCondition(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias, string $field, ?array $args): ?string
    {
        if (!$args) {
            return null;
        }

        $textFormat = new TextFormat($args['value']);
        $exactTerms = $textFormat->exactTerms();
        $notExactTerms = $textFormat->notExactTerms();

        if (!$exactTerms && !$notExactTerms) {
            return null;
        }

        $scalarFields = $this->getSearchableFields($metadata, $alias);
        $fieldsOnJoin = $this->getSearchableFieldsOnJoin($uniqueNameFactory, $metadata, $queryBuilder, $alias);
        $allFields = array_merge($scalarFields, $fieldsOnJoin);

        return $this->buildSearchDqlCondition($uniqueNameFactory, $metadata, $queryBuilder, $allFields, $notExactTerms, $exactTerms);
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
     * Return searchable fields from a joined entity.
     *
     * This should be avoided if possible to instead only search in the original entity itself.
     */
    protected function getSearchableFieldsOnJoin(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias): array
    {
        $config = $this->getSearchableJoinedEntities();

        $fields = [];
        foreach ($config as $class => $fieldNames) {
            if (is_a($metadata->getName(), $class, true)) {
                foreach ($fieldNames as $fieldName) {
                    $fields = array_merge(
                        $fields,
                        $this->searchOnJoinedEntity($uniqueNameFactory, $metadata, $queryBuilder, $alias, $fieldName)
                    );
                }
            }
        }

        return $fields;
    }

    /**
     * Add a join and return searchable fields in order to search on a joined entity.
     *
     * @return string[]
     */
    protected function searchOnJoinedEntity(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias, string $fieldName): array
    {
        $association = $metadata->getAssociationMapping($fieldName);
        $targetEntity = $association['targetEntity'];

        $joinedMetadata = $queryBuilder->getEntityManager()->getMetadataFactory()->getMetadataFor($targetEntity);
        $joinedAlias = $uniqueNameFactory->createAliasName($targetEntity);

        $this->mapAliasToMetadata[$joinedAlias] = $joinedMetadata;
        $queryBuilder->leftJoin($alias . '.' . $fieldName, $joinedAlias, Join::WITH);

        return $this->getSearchableFields($joinedMetadata, $joinedAlias);
    }

    /**
     * Return a DQL condition to search each of the words in any of the fields.
     */
    protected function buildSearchDqlCondition(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, array $fields, array $words, array $exactTerms): string
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
        // Ex. Notre-Dame becomes two words: Notre and Dame.
        $words = array_merge(
            ...array_map(
                fn ($word) => explode(' ', $this->cleanFullTextSpecialChars($word)),
                $words,
            )
        );

        $andWheres = [];
        foreach ($words as $word) {
            $orWheres = [];

            // Fulltext search is configured for minimum 3 characters length.
            // If there are only words smaller than 3 characters, we will make a classic search (LIKE).
            if (mb_strlen($word) > 2 && count($fullTextIndexes) > 0) {
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

            $andWheres[] = '(' . implode(' OR ', $orWheres) . ')';
        }

        foreach ($exactTerms as $exactTerm) {
            $orWheres = [];

            // Fulltext search is configured for minimum 3 characters length.
            // If there are only words smaller than 3 characters, we will make a classic search (LIKE).
            if (mb_strlen($exactTerm) > 2 && count($fullTextIndexes) > 0) {
                $fieldsForLike = $fieldsFullTextNotUsed;

                $parameterName = $uniqueNameFactory->createParameterName();

                // "+": The word is mandatory in all rows returned.
                $cleanedExactTerm = $this->cleanFullTextSpecialChars($exactTerm);
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

            $andWheres[] = '(' . implode(' OR ', $orWheres) . ')';
        }

        return implode(' AND ', $andWheres);
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
        $result = mb_ereg_replace('[+\-<>()~*]', ' ', $word);

        return $result === false || $result === null ? $word : $result;
    }
}
