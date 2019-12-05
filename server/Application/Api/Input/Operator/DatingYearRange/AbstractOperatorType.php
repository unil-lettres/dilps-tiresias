<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator\DatingYearRange;

use Application\Model\Dating;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use GraphQL\Doctrine\Definition\Operator\AbstractOperator;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\LeafType;

abstract class AbstractOperatorType extends AbstractOperator
{
    /**
     * @var UniqueNameFactory
     */
    private $uniqueNameFactory;

    /**
     * @var int
     */
    private $year;

    /**
     * @var QueryBuilder
     */
    private $queryBuilder;

    abstract protected function getInternalDqlCondition(string $datingAlias): string;

    protected function getConfiguration(LeafType $leafType): array
    {
        return [
            'description' => 'Filter the cards by datings year range',
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

        $datingAlias = $uniqueNameFactory->createAliasName(Dating::class);
        $this->uniqueNameFactory = $uniqueNameFactory;
        $this->queryBuilder = $queryBuilder;
        $this->year = $year;

        $queryBuilder->innerJoin($alias . '.datings', $datingAlias);

        return $this->getInternalDqlCondition($datingAlias);
    }

    protected function createParam(bool $end = false): string
    {
        $param = $this->uniqueNameFactory->createParameterName();
        $this->queryBuilder->setParameter($param, $this->yearToJulian($this->year, $end));

        return ':' . $param;
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
}
