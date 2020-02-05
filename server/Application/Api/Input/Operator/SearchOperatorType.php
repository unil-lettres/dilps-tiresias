<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Application\Model\Artist;
use Application\Model\Card;
use Application\Model\Institution;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use GraphQL\Doctrine\Definition\Operator\AbstractOperator;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\LeafType;

class SearchOperatorType extends AbstractOperator
{
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

        $words = preg_split('/[[:space:]]+/', $args['value'], -1, PREG_SPLIT_NO_EMPTY);
        if (!$words) {
            return null;
        }

        $fields = $this->getSearchableFields($uniqueNameFactory, $metadata, $queryBuilder, $alias);

        // Build the WHERE clause
        $wordWheres = [];
        foreach ($words as $i => $word) {
            $parameterName = $uniqueNameFactory->createParameterName();

            $fieldWheres = [];
            foreach ($fields as $field) {
                $fieldWheres[] = $field . ' LIKE :' . $parameterName;
            }

            if ($fieldWheres) {
                $wordWheres[] = '(' . implode(' OR ', $fieldWheres) . ')';
                $queryBuilder->setParameter($parameterName, '%' . $word . '%');
            }
        }

        return '(' . implode(' AND ', $wordWheres) . ')';
    }

    protected function getSearchableFields(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias): array
    {
        $whitelistedFields = [
            'name',
            'expandedName',
            'street',
            'locality',
            'material',
            'technique',
            'addition',
            'login',
            'email',
            'dating',
            'id',
            'code',
        ];

        // Find most textual fields for the entity
        $fields = [];
        foreach ($metadata->fieldMappings as $mapping) {
            if (in_array($mapping['fieldName'], $whitelistedFields, true)) {
                $fieldName = $mapping['fieldName'];
                $field = $alias . '.' . $fieldName;

                $fields[] = $field;
            }
        }

        // Special case for Card to add joined fields
        if ($metadata->name === Card::class) {
            $institution = $uniqueNameFactory->createAliasName(Institution::class);
            $artist = $uniqueNameFactory->createAliasName(Artist::class);

            $queryBuilder->leftJoin($alias . '.institution', $institution);
            $queryBuilder->leftJoin($alias . '.artists', $artist);

            $fields[] = $institution . '.name';
            $fields[] = $artist . '.name';
        }

        return $fields;
    }
}
