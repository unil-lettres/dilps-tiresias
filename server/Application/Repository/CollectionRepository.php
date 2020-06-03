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
     * - collection parent is accessible (recursively)
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

        // Todo : grant access to collections visible by admins to majors ?
        $visibility = [Collection::VISIBILITY_MEMBER];
        if ($user->getRole() === User::ROLE_ADMINISTRATOR) {
            $visibility[] = Collection::VISIBILITY_ADMINISTRATOR;
        }

        $userId = $this->getEntityManager()->getConnection()->quote($user->getId());
        $visibility = $this->quoteArray($visibility);

        $isAccessible = <<<STRING
            collection.visibility IN ($visibility)
            OR collection.owner_id = $userId
            OR collection.creator_id = $userId
            OR cu.user_id = $userId 
STRING;

        $sql = <<<STRING
WITH RECURSIVE parent AS (

SELECT collection.id, collection.parent_id FROM collection
LEFT JOIN collection_user cu ON collection.id = cu.collection_id
WHERE
parent_id IS NULL 
AND ($isAccessible)

UNION

SELECT collection.id, collection.parent_id FROM collection
INNER JOIN parent ON collection.parent_id = parent.id
LEFT JOIN collection_user cu ON collection.id = cu.collection_id
WHERE
$isAccessible

) SELECT id FROM parent
STRING;

        return $sql;
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
