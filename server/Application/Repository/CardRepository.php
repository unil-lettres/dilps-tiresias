<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Card;
use Application\Model\Collection;
use Application\Model\User;
use Doctrine\ORM\QueryBuilder;

class CardRepository extends AbstractRepository implements \Ecodev\Felix\Repository\LimitedAccessSubQuery
{
    public function getFindAllByCollections(array $collections = []): QueryBuilder
    {
        $qb = $this->createQueryBuilder('card');

        if (isset($collections)) {
            if (\count($collections) > 0) {
                $qb->join('card.collections', 'collection');
                $qb->andWhere('collection.id IN (:collections)');
                $qb->setParameter('collections', $collections);
            } else {
                $qb->andWhere('card.collections IS EMPTY');
            }
        }

        return $qb;
    }

    /**
     * Returns pure SQL to get ID of all cards that are accessible to given user.
     * A card is accessible if:
     * - card is public
     * - card is member and user is logged in
     * - card owner or creator is the user
     * - card's collection responsible is the user
     */
    public function getAccessibleSubQuery(?\Ecodev\Felix\Model\User $user): string
    {
        if ($user && $user->getRole() === User::ROLE_ADMINISTRATOR) {
            return '';
        }

        $visibility = [Card::VISIBILITY_PUBLIC];
        if ($user) {
            $visibility[] = Card::VISIBILITY_MEMBER;
        }

        $qb = $this->getEntityManager()
            ->getConnection()
            ->createQueryBuilder()
            ->select('card.id')
            ->from('card')
            ->where('card.visibility IN (' . $this->quoteArray($visibility) . ')');

        if ($user) {
            $userId = $this->getEntityManager()->getConnection()->quote($user->getId());
            $qb->leftJoin('card', 'card_collection', 'card_collection', 'card_collection.card_id = card.id')
                ->leftJoin('card_collection', 'collection_user', 'collection_user', 'card_collection.collection_id = collection_user.collection_id')
                ->orWhere('card.owner_id = ' . $userId)
                ->orWhere('card.creator_id = ' . $userId)
                ->orWhere('collection_user.user_id = ' . $userId);
        }

        return $qb->getSQL();
    }

    /**
     * Returns all filename in DB and their id and sizes
     *
     * @return string[]
     */
    public function getFilenamesForDimensionUpdate(?string $site = null): array
    {
        $filenames = $this->getEntityManager()->getConnection()->createQueryBuilder()
            ->from('card')
            ->addSelect('id')
            ->addSelect('width')
            ->addSelect('height')
            ->addSelect('CONCAT("data/images/", filename) AS filename')
            ->where('filename != ""')
            ->orderBy('filename');

        if ($site) {
            $filenames
                ->where('site = "' . $site . '"');
        }

        return $filenames->execute()->fetchAll();
    }

    /**
     * Return the next available code
     */
    public function getNextCodeAvailable(Collection $collection): string
    {
        static $nextId = null;

        if (!$nextId) {
            $connection = _em()->getConnection();
            $database = $connection->quote($connection->getDatabase());

            $sql = "SELECT `AUTO_INCREMENT`
                FROM INFORMATION_SCHEMA.TABLES
                WHERE TABLE_SCHEMA = $database
                AND TABLE_NAME = 'card'";

            $nextId = (int) $connection->fetchColumn($sql);
        } else {
            ++$nextId;
        }

        return $collection->getName() . '-' . $nextId;
    }

    /**
     * Get a card from it's legacy id.
     */
    public function getOneByLegacyId(int $legacy_id): ?Card
    {
        return $this->getAclFilter()->runWithoutAcl(function () use ($legacy_id) {
            return $this->findOneBy([
                'legacyId' => $legacy_id,
            ]);
        });
    }
}
