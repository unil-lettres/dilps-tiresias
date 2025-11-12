<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Card;
use Application\Model\Domain;

/**
 * @extends AbstractHasParentRepository<Domain>
 */
class DomainRepository extends AbstractHasParentRepository
{
    public function getByCards(array $filter): array
    {
        // Create filtered query builder for the subquery
        $cardQb = _types()->createFilteredQueryBuilder(Card::class, $filter, []);
        $cardAlias = $cardQb->getRootAliases()[0];
        $cardQb->select($cardAlias . '.id');

        $qb = $this
            ->createQueryBuilder('d')
            ->innerJoin(Card::class, 'c')
            ->innerJoin('c.domains', 'd2', 'WITH', 'd2.id = d.id')
            ->where('c.id IN (' . $cardQb->getDQL() . ')')
            ->groupBy('d.id')
            ->orderBy('COUNT(c.id)', 'DESC')
            ->addOrderBy('d.id', 'ASC')
            ->setParameters($cardQb->getParameters());

        return $qb->getQuery()->getResult();
    }
}
