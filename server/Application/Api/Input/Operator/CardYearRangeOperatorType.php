<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Application\Model\Period;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use GraphQL\Doctrine\Definition\Operator\AbstractOperator;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\LeafType;

class CardYearRangeOperatorType extends AbstractOperator
{
    protected function getConfiguration(LeafType $leafType): array
    {
        return [
            'fields' => [
                [
                    'name' => 'from',
                    'type' => self::nonNull(self::int()),
                ],
                [
                    'name' => 'to',
                    'type' => self::nonNull(self::int()),
                ],
            ],
        ];
    }

    public function getDqlCondition(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias, string $field, ?array $args): string
    {
        if (!$args) {
            return '';
        }

        $periods = $uniqueNameFactory->createAliasName(Period::class);
        $queryBuilder->leftJoin($alias . '.periods', $periods);

        $from = $uniqueNameFactory->createParameterName();
        $to = $uniqueNameFactory->createParameterName();

        $queryBuilder->setParameter($from, $args['from']);
        $queryBuilder->setParameter($to, $args['to']);

        return DatingYearRangeOperatorType::matchPeriods($alias, $from, $to) . ' OR ' . DatingYearRangeOperatorType::matchPeriods($periods, $from, $to);
    }
}
