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
        // Count the domains directly on the filtered cards, because a subquery of the filtered cards is much slower
        $cardQb = _types()->createFilteredQueryBuilder(Card::class, $filter, []);
        $cardAlias = $cardQb->getRootAliases()[0];
        $ids = $cardQb
            ->select('countedDomain.id')
            ->innerJoin($cardAlias . '.domains', 'countedDomain')
            ->groupBy('countedDomain.id')
            ->orderBy('COUNT(DISTINCT ' . $cardAlias . '.id)', 'DESC')
            ->addOrderBy('countedDomain.id', 'ASC')
            ->getQuery()
            ->getSingleColumnResult();

        if (!$ids) {
            return [];
        }

        $domains = [];
        foreach ($this->findBy(['id' => $ids]) as $domain) {
            $domains[$domain->getId()] = $domain;
        }

        return array_values(array_filter(array_map(fn ($id) => $domains[$id] ?? null, $ids)));
    }
}
