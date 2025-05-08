<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Card;
use Application\Model\Domain;
use Doctrine\ORM\QueryBuilder;

/**
 * @extends AbstractHasParentRepository<Domain>
 */
class DomainRepository extends AbstractHasParentRepository
{
    public function getByCards(QueryBuilder $cardQb): array
    {
        $cardIds = array_map(fn ($card) => $card->getId(), $cardQb->getQuery()->getResult());

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
