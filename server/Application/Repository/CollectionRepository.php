<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Enum\CollectionVisibility;
use Application\Model\Card;
use Application\Model\Collection;
use Application\Model\User;
use Ecodev\Felix\Utility;

/**
 * @extends AbstractHasParentRepository<Collection>
 */
class CollectionRepository extends AbstractHasParentRepository implements \Ecodev\Felix\Repository\LimitedAccessSubQuery
{
    /**
     * Returns pure SQL to get ID of all collections that are accessible to given user.
     *
     * A collection is accessible if:
     *
     * - collection is member and user is logged in
     * - collection is admin and user is admin
     * - collection owner, creator, responsible or subscriber is the user
     * - collection parent is accessible (recursively)
     */
    public function getAccessibleSubQuery(?\Ecodev\Felix\Model\User $user): string
    {
        if (!$user) {
            return '-1';
        }

        // Todo : grant access to collections visible by admins to majors ?
        $visibility = [CollectionVisibility::Member->value];
        if ($user->getRole() === User::ROLE_ADMINISTRATOR) {
            $visibility[] = CollectionVisibility::Administrator->value;
        }

        $userId = $user->getId() ?? -1;
        $visibility = Utility::quoteArray($visibility);

        $isAccessible = <<<STRING
                        collection.visibility IN ($visibility)
                        OR collection.owner_id = $userId
                        OR collection.creator_id = $userId
                        OR cu.user_id = $userId
                        OR cs.user_id = $userId
            STRING;

        // Membership joins are restricted to the user, to avoid multiplying rows by the number of members
        $sql = <<<STRING
            WITH RECURSIVE parent AS (

            SELECT collection.id, collection.parent_id FROM collection
            LEFT JOIN collection_responsible cu ON collection.id = cu.collection_id AND cu.user_id = $userId
            LEFT JOIN collection_subscriber cs ON collection.id = cs.collection_id AND cs.user_id = $userId
            WHERE
            parent_id IS NULL
            AND ($isAccessible)

            UNION

            SELECT collection.id, collection.parent_id FROM collection
            INNER JOIN parent ON collection.parent_id = parent.id
            LEFT JOIN collection_responsible cu ON collection.id = cu.collection_id AND cu.user_id = $userId
            LEFT JOIN collection_subscriber cs ON collection.id = cs.collection_id AND cs.user_id = $userId
            WHERE
            $isAccessible

            ) SELECT id FROM parent
            STRING;

        return $sql;
    }

    /**
     * Duplicate all accessible images from source collection into target collection.
     */
    public function linkCollectionToCollection(Collection $sourceCollection, Collection $targetCollection): void
    {
        /** @var CardRepository $cardRepository */
        $cardRepository = $this->getEntityManager()->getRepository(Card::class);
        $cardSubQuery = $cardRepository->getAccessibleSubQuery(User::getCurrent());

        $connection = $this->getEntityManager()->getConnection();
        $connection->executeStatement('REPLACE INTO card_collection (collection_id, card_id)
            SELECT ' . ($targetCollection->getId() ?? -1) . ' AS collection_id, card_id
            FROM card_collection
            WHERE
            collection_id = ' . ($sourceCollection->getId() ?? -1) . '
            ' . (empty($cardSubQuery) ? '' : 'AND card_id IN (' . $cardSubQuery . ')'));
    }

    public function getCopyrights(Card $card): string
    {
        $sql = <<<STRING
                SELECT GROUP_CONCAT(NULLIF(CONCAT_WS(
                    ' ',
                    NULLIF(TRIM(copyrights), ''),
                    NULLIF(CONCAT('(', TRIM(usage_rights), ')'), '()')
                ), '') ORDER BY id SEPARATOR ', ')
                FROM collection
                    INNER JOIN card_collection ON collection.id = card_collection.collection_id AND card_collection.card_id = :card
                    WHERE collection.is_source
            STRING;

        $result = $this->getEntityManager()->getConnection()->fetchOne($sql, ['card' => $card->getId()]);

        return $result ?? '';
    }
}
