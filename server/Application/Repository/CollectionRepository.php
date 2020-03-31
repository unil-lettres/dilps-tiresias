<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Card;
use Application\Model\Collection;
use Application\Model\User;

class CollectionRepository extends AbstractRepository implements LimitedAccessSubQueryInterface
{
    /**
     * Returns pure SQL to get ID of all collections that are accessible to given user.
     *
     * A collection is accessible if:
     *
     * - collection is member and user is logged in
     * - collection is admin and user is admin
     * - collection owner, creator or responsible is the user
     *
     * @param null|User $user
     *
     * @return string
     */
    public function getAccessibleSubQuery(?User $user): string
    {
        if (!$user) {
            return '-1';
        }

        $visibility = [Collection::VISIBILITY_MEMBER];
        if ($user->getRole() === User::ROLE_ADMINISTRATOR) {
            $visibility[] = Collection::VISIBILITY_ADMINISTRATOR;
        }

        $userId = $this->getEntityManager()->getConnection()->quote($user->getId());

        $qb = $this->getEntityManager()
            ->getConnection()
            ->createQueryBuilder()
            ->select('collection.id')
            ->from('collection')
            ->leftJoin('collection', 'collection_user', 'cu', 'collection.id = cu.collection_id')
            ->where('collection.visibility IN (' . $this->quoteArray($visibility) . ')')
            ->orWhere('collection.owner_id = ' . $userId)
            ->orWhere('collection.creator_id = ' . $userId)
            ->orWhere('cu.user_id = ' . $userId);

        return $qb->getSQL();
    }

    /**
     * Duplicate all accessible images from source collection into target collection
     *
     * @param Collection $sourceCollection
     * @param Collection $targetCollection
     */
    public function linkCollectionToCollection(Collection $sourceCollection, Collection $targetCollection): void
    {
        $cardSubQuery = $this->getEntityManager()->getRepository(Card::class)->getAccessibleSubQuery(User::getCurrent());

        $connection = $this->getEntityManager()->getConnection();
        $connection->query('REPLACE INTO collection_card (collection_id, card_id)
            SELECT ' . $connection->quote($targetCollection->getId()) . ' AS collection_id, card_id
            FROM collection_card
            WHERE
            collection_id = ' . $connection->quote($sourceCollection->getId()) . '
            AND card_id IN (' . $cardSubQuery . ')');
    }
}
