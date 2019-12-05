<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Api\Input\Operator\SearchOperatorType;
use Application\Api\Input\Sorting\Random;
use Application\ORM\Query\Filter\AclFilter;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\Type;

abstract class AbstractRepository extends EntityRepository
{
    public function getFindAllQuery(array $filters = [], array $sorting = []): QueryBuilder
    {
        $reflect = $this->getClassMetadata()->getReflectionClass();
        $name = lcfirst($reflect->getShortName());

        $qb = $this->createQueryBuilder($name);
        foreach ($filters as $key => $value) {
            $qb->andWhere($name . '.' . $key . '=' . $this->getEntityManager()->getConnection()->quote($value));
        }

        $this->applySorting($qb, $sorting, $name);

        return $qb;
    }

    protected function applySorting(QueryBuilder $qb, array $sorting, string $alias): void
    {
        foreach ($sorting as $sort) {
            if ($sort['field'] === 'random') {
                $random = new Random();
                $random(new UniqueNameFactory(), $this->getClassMetadata(), $qb, $alias, $sort['order']);
            } else {
                $qb->addOrderBy($alias . '.' . $sort['field'], $sort['order']);
            }
        }
    }

    /**
     * Returns the AclFilter to fetch ACL filtering SQL
     *
     * @return AclFilter
     */
    public function getAclFilter(): AclFilter
    {
        return $this->getEntityManager()->getFilters()->getFilter(AclFilter::class);
    }

    /**
     * Return all ID
     *
     * @return string
     */
    protected function getAllIdsQuery(): string
    {
        $qb = $this->getEntityManager()->getConnection()->createQueryBuilder()
            ->select('id')
            ->from($this->getClassMetadata()->getTableName());

        return $qb->getSQL();
    }

    protected function quoteArray(array $values): string
    {
        $result = [];
        foreach ($values as $v) {
            $result[] = $this->getEntityManager()->getConnection()->quote($v);
        }

        return implode(', ', $result);
    }

    /**
     * Modify $qb to add a constraint to search for all words contained in $search.
     *
     * @param QueryBuilder $qb
     * @param array $filters
     * @param string $alias
     */
    protected function applySearch(QueryBuilder $qb, array $filters, string $alias): void
    {
        $search = $filters['search'] ?? '';
        $operator = new SearchOperatorType(_types(), Type::string());
        $unique = new UniqueNameFactory();

        $dqlCondition = $operator->getDqlCondition($unique, $this->getClassMetadata(), $qb, $alias, 'non-used-field-name', ['value' => $search]);
        if ($dqlCondition) {
            $qb->andWhere($dqlCondition);
        }
    }
}
