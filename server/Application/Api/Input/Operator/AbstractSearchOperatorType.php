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
            if (in_array($mapping['fieldName'], $whitelistedFields, true)) {
                $fieldName = $mapping['fieldName'];
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

        $matchesWhere = [];

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

        // Fulltext search is configured for minimum 3 characters length.
        $wordsCandidate = array_filter($words, fn ($word) => mb_strlen($word) > 2);
        $exactTermsCandidate = array_filter($exactTerms, fn ($exactTerm) => mb_strlen($exactTerm) > 2);

        // If there are only words smaller than 3 characters, we will make a classic search (LIKE).
        // If there is at least one word greather than 2 characters, we use fulltext search and
        // ignore the smaller words.
        if (!empty($wordsCandidate) || !empty($exactTermsCandidate)) {
            // Search if a table has a fulltext index available for the specified columns.
            // It searches in the Doctrine metadata and not in the database schema.
            foreach ($fieldsByTable as $table => $tableFields) {
                $metadataClass = $this->mapAliasToMetadata[$table];

                // Find an index flagged as fulltext.
                foreach ($metadataClass->table['indexes'] as $index) {
                    if (in_array('fulltext', $index['flags'] ?? [], true)) {
                        // Check that all table fields are in the index columns.
                        $fieldsInIndex = array_intersect($tableFields, $index['fields']);

                        if (count($fieldsInIndex) === count($index['fields'])) {
                            // All fields are in the index, we can use it.

                            $parameterName = $uniqueNameFactory->createParameterName();
                            $fullFieldsInIndex = array_map(fn ($field) => "$table.$field", $fieldsInIndex);
                            $strFieldsInIndex = implode(',', $fullFieldsInIndex);

                            // The "> 0" is a hack for Doctrine to not raise a syntaxe error.
                            $matchesWhere[] = " (MATCH ($strFieldsInIndex) AGAINST (:$parameterName IN BOOLEAN MODE) > 0) ";

                            $against = [];

                            // Transform $wordsCandidate array to "+word1* +word2*".
                            // With fulltext search, we cannot use wildcards at the
                            // begining of a word (simulating  "LIKE '%word'"). It is
                            // a small drawback that should not causes too much trouble.
                            if (!empty($wordsCandidate)) {
                                $against[] = '+' . implode('* +', $wordsCandidate) . '*';
                            }

                            // Transform $exactTerms array to '+"exactTerm1" +"exactTerm2"'.
                            if (!empty($exactTermsCandidate)) {
                                $against[] = '+"' . implode('" +"', $exactTermsCandidate) . '"';
                            }

                            $queryBuilder->setParameter(
                                $parameterName,
                                implode(' ', $against)
                            );

                            // Remove fields used in fulltext search from fields list.
                            $fields = array_diff($fields, $fullFieldsInIndex);
                        }
                    }
                }
            }
        }

        // Do not search ID with like, but with index.
        $numbers = array_map('intval', array_filter($words, 'is_numeric'));
        foreach ($fieldsByTable as $table => $tableFields) {
            if (in_array('id', $tableFields, true)) {
                if (!empty($numbers)) {
                    $parameterName = $uniqueNameFactory->createParameterName();
                    $matchesWhere[] = " $table.id IN (:$parameterName) ";

                    $queryBuilder->setParameter(
                        $parameterName,
                        $numbers,
                    );
                }
                $fields = array_diff($fields, ["$table.id"]);
            }
        }

        $wordWheres = [];

        if (!empty($fields)) {
            foreach ($words as $word) {
                $parameterName = $uniqueNameFactory->createParameterName();

                $fieldWheres = [];
                foreach ($fields as $field) {
                    $fieldWheres[] = $field . ' LIKE :' . $parameterName;
                }

                $wordWheres[] = '(' . implode(' OR ', $fieldWheres) . ')';
                $queryBuilder->setParameter($parameterName, '%' . $word . '%');
            }

            foreach ($exactTerms as $exactTerm) {
                $parameterName = $uniqueNameFactory->createParameterName();

                $fieldWheres = [];
                foreach ($fields as $field) {
                    $comparisons = [
                        "$field LIKE :{$parameterName}_start",
                        "$field LIKE :{$parameterName}_middle",
                        "$field LIKE :{$parameterName}_end",
                        "$field = :{$parameterName}_exact",
                    ];

                    $fieldWheres[] = '(' . implode(' OR ', $comparisons) . ')';
                }

                $wordWheres[] = '(' . implode(' OR ', $fieldWheres) . ')';

                $queryBuilder->setParameter("{$parameterName}_start", "$exactTerm %");
                $queryBuilder->setParameter("{$parameterName}_middle", "% $exactTerm %");
                $queryBuilder->setParameter("{$parameterName}_end", "% $exactTerm");
                $queryBuilder->setParameter("{$parameterName}_exact", $exactTerm);
            }
        }

        $wheres = [];
        if ($wordWheres) {
            $wheres[] = '(' . implode(' AND ', $wordWheres) . ')';
        }
        if ($matchesWhere) {
            $wheres[] = '(' . implode(' OR ', $matchesWhere) . ')';
        }

        return implode(' OR ', $wheres);
    }
}
