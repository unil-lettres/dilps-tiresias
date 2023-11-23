<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Card;

use Application\Model\File;

/**
 * @extends AbstractRepository<File>
 */
class FileRepository extends AbstractRepository implements \Ecodev\Felix\Repository\LimitedAccessSubQuery
{
    /**
     * Returns pure SQL to get ID of all files that are accessible to given user.
     * A file is accessible if:
     * - the file card is accessible.
     */
    public function getAccessibleSubQuery(?\Ecodev\Felix\Model\User $user): string
    {
        /** @var CardRepository $cardRepository */
        $cardRepository = $this->getEntityManager()->getRepository(Card::class);
        $cardSubQuery = $cardRepository->getAccessibleSubQuery($user);

        if ($cardSubQuery) {
            return 'SELECT id FROM file WHERE card_id IN (' . $cardSubQuery . ')';
        }

        return '';
    }
}
