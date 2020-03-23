<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Application\Model\Dating;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use GraphQL\Doctrine\Definition\Operator\AbstractOperator;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\LeafType;

class DatingYearRangeOperatorType extends AbstractOperator
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

    public function getDqlCondition(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias, string $field, ?array $args): ?string
    {
        if (!$args) {
            return null;
        }

        $datings = $uniqueNameFactory->createAliasName(Dating::class);
        $queryBuilder->innerJoin($alias . '.datings', $datings);

        $from = $uniqueNameFactory->createParameterName();
        $to = $uniqueNameFactory->createParameterName();

        $queryBuilder->setParameter($from, $this->yearToJulian($args['from']));
        $queryBuilder->setParameter($to, $this->yearToJulian($args['to'], true));

        return self::matchPeriods($datings, $from, $to);
    }

    private function yearToJulian(int $year, bool $end = false): int
    {
        if ($end) {
            $day = 31;
            $month = 12;
        } else {
            $day = 1;
            $month = 1;
        }

        return gregoriantojd($month, $day, $year);
    }

    /**
     * Return DQL to match a period defined by `to` and `from` fields on the $alias table with the period defined by $from and $to DQL parameter names
     *
     * @param string $alias
     * @param string $from
     * @param string $to
     *
     * @return string
     */
    public static function matchPeriods(string $alias, string $from, string $to): string
    {
        return "((:$from >= $alias.from AND :$from <= $alias.to) OR (:$to <= $alias.to AND :$to >= $alias.from) OR (:$from <= $alias.from AND :$to >= $alias.to))";
    }
}
