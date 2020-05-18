<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\ORM\Query\Filter\AclFilter;
use Doctrine\ORM\EntityRepository;

abstract class AbstractRepository extends EntityRepository
{
    /**
     * Returns the AclFilter to fetch ACL filtering SQL
     */
    public function getAclFilter(): AclFilter
    {
        return $this->getEntityManager()->getFilters()->getFilter(AclFilter::class);
    }

    /**
     * Return all ID
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
}
