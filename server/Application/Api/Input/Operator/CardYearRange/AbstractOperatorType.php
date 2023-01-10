<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator\CardYearRange;

use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use Ecodev\Felix\ORM\Query\NativeIn;
use GraphQL\Doctrine\Definition\Operator\AbstractOperator;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\LeafType;

abstract class AbstractOperatorType extends AbstractOperator
{
    abstract protected function getSqlCondition(string $param): string;

    protected function getConfiguration(LeafType $leafType): array
    {
        return [
            'description' => 'Filter the cards by precise year range',
            'fields' => [
                [
                    'name' => 'value',
                    'type' => self::nonNull(self::int()),
                ],
            ],
        ];
    }

    public function getDqlCondition(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias, string $field, ?array $args): ?string
    {
        if (!$args) {
            return null;
        }

        $year = $args['value'];
        $sql = $this->getSqlCondition($queryBuilder->getEntityManager()->getConnection()->quote($year));

        return NativeIn::dql($alias, $sql);
    }
}
