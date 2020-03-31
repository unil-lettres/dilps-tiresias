<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Card;
use Application\Model\Collection;
use Application\Model\User;
use Doctrine\ORM\QueryBuilder;

class CardRepository extends AbstractRepository implements LimitedAccessSubQueryInterface
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
     *
     * @param null|User $user
     *
     * @return string
     */
    public function getAccessibleSubQuery(?User $user): string
    {
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
            $qb->leftJoin('card', 'collection_card', 'collection_card', 'collection_card.card_id = card.id')
                ->leftJoin('collection_card', 'collection_user', 'collection_user', 'collection_card.collection_id = collection_user.collection_id')
                ->orWhere('card.owner_id = ' . $userId)
                ->orWhere('card.creator_id = ' . $userId)
                ->orWhere('collection_user.user_id = ' . $userId);
        }

        return $qb->getSQL();
    }

    /**
     * Returns all unique filename in DB
     *
     * @return string[]
     */
    public function getFilenames(): array
    {
        $filenames = $this->getEntityManager()->getConnection()->createQueryBuilder()
            ->from('card')
            ->select('DISTINCT CONCAT("data/images/", filename)')
            ->where('filename != ""')
            ->orderBy('filename')->execute()->fetchAll(\PDO::FETCH_COLUMN);

        return $filenames;
    }

    /**
     * Returns all filename in DB and their id and sizes
     *
     * @return string[]
     */
    public function getFilenamesForDimensionUpdate(): array
    {
        $filenames = $this->getEntityManager()->getConnection()->createQueryBuilder()
            ->from('card')
            ->addSelect('id')
            ->addSelect('width')
            ->addSelect('height')
            ->addSelect('CONCAT("data/images/", filename) AS filename')
            ->where('filename != ""')
            ->orderBy('filename')->execute()->fetchAll();

        return $filenames;
    }

    /**
     * Return the next available Account code
     *
     * @return string
     */
    public function getNextCodeAvailable(Collection $collection): string
    {
        static $latest = null;
        if (!$latest) {
            $qb = $this->getEntityManager()->getConnection()->createQueryBuilder()
                ->select('IFNULL(MAX(card.id) + 1, 1)')
                ->from('card', 'card');
            $latest = $qb->execute()->fetchColumn();
        } else {
            ++$latest;
        }

        return $collection->getName() . '-' . $latest;
    }
}
