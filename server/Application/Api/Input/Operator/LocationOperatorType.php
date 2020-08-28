<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use GraphQL\Doctrine\Definition\Operator\AbstractOperator;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\LeafType;

class LocationOperatorType extends AbstractOperator
{
    protected function getConfiguration(LeafType $leafType): array
    {
        return [
            'fields' => [
                [
                    'name' => 'longitude',
                    'type' => self::nonNull(self::float()),
                ],
                [
                    'name' => 'latitude',
                    'type' => self::nonNull(self::float()),
                ],
                [
                    'name' => 'distance',
                    'type' => self::nonNull(self::float()),
                ],
            ],
        ];
    }

    public function getDqlCondition(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias, string $field, ?array $args): ?string
    {
        if (!$args) {
            return null;
        }

        $point = 'POINT(' . $args['longitude'] . ' ' . $args['latitude'] . ')';

        $paramPoint = $uniqueNameFactory->createParameterName();
        $paramDistance = $uniqueNameFactory->createParameterName();

        $queryBuilder->setParameter($paramPoint, $point);
        $queryBuilder->setParameter($paramDistance, $args['distance'] / 100000);

        return "ST_Distance(GeomFromText(:$paramPoint), $alias.location) < :$paramDistance";
    }
}
