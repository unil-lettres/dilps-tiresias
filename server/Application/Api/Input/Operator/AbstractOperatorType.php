<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Doctrine\ORM\QueryBuilder;
use GraphQL\Doctrine\Definition\Operator\AbstractOperator;

abstract class AbstractOperatorType extends AbstractOperator
{
    /**
     * Create a QueryBuilder for the same entity as the given QueryBuilder, but with the new  given alias.
     */
    protected function createSubQueryBuilder(QueryBuilder $qb, string $subAlias): QueryBuilder
    {
        $rootEntities = $qb->getRootEntities();
        $entity = reset($rootEntities);
        $subQb = $qb->getEntityManager()->createQueryBuilder()
            ->select($subAlias)
            ->from($entity, $subAlias);

        return $subQb;
    }

    protected function getSubQueryDqlCondition(string $alias, QueryBuilder $subQb): string
    {
        return $alias . '.id IN (' . $subQb->getDQL() . ')';
    }
}
