<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Card;
use Application\Model\Export;
use Application\Model\User;

class ExportRepository extends AbstractRepository
{
    public function updateCards(Export $export, array $cardIds): int
    {
        $connection = $this->getEntityManager()->getConnection();

        // Inject all cards from collection
        $collection = $export->getCollection();
        if ($collection) {
            $sql = 'REPLACE INTO export_card (export_id, card_id) SELECT :export, card_id FROM card_collection WHERE card_collection.collection_id = :collection';

            $params = [
                'export' => $export->getId(),
                'collection' => $collection->getId(),
            ];
            $connection->executeStatement($sql, $params);
        }

        $cardValues = [];
        $exportId = $export->getId();
        foreach ($cardIds as $id) {
            $cardValues[] = '(' . $exportId . ', ' . $connection->quote($id) . ')';
        }

        // Inject all card picked one-by-oneS
        if ($cardValues) {
            $values = implode(', ', $cardValues);
            $connection->executeStatement('REPLACE INTO export_card (export_id, card_id) VALUES ' . $values);
        }

        /** @var CardRepository $cardRepository */
        $cardRepository = $this->getEntityManager()->getRepository(Card::class);
        $cardSubQuery = $cardRepository->getAccessibleSubQuery(User::getCurrent());
        $params = ['export' => $export->getId()];

        // Remove card to which we have no access
        if ($cardSubQuery) {
            $connection->executeStatement('DELETE FROM export_card WHERE export_id = :export AND card_id NOT IN (' . $cardSubQuery . ')', $params);
        }

        $cardCount = $connection->fetchOne('SELECT COUNT(*) FROM export_card WHERE export_id = :export', $params);

        return (int) $cardCount;
    }
}
