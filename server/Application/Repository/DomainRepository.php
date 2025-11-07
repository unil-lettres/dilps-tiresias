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
        // Create filtered query builder and select only IDs to minimize memory usage
        $cardQb = _types()->createFilteredQueryBuilder(Card::class, $filter, []);
        $cardAlias = $cardQb->getRootAliases()[0];
        $cardQb->select($cardAlias . '.id');

        $result = $cardQb->getQuery()->getScalarResult();
        $cardIds = array_column($result, 'id');

        if (count($cardIds) === 0) {
            return [];
        }

        $qb = $this
            ->createQueryBuilder('d')
            ->innerJoin(Card::class, 'c')
            ->innerJoin('c.domains', 'd2', 'WITH', 'd2.id = d.id')
            ->where('c.id in (' . implode(',', $cardIds) . ')')
            ->groupBy('d.id')
            ->orderBy('COUNT(c.id)', 'DESC');

        return $qb->getQuery()->getResult();
    }
}
