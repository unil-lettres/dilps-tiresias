<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Card;
use Application\Model\Export;
use Application\Model\User;

/**
 * @extends AbstractRepository<Export>
 */
class ExportRepository extends AbstractRepository implements \Ecodev\Felix\Repository\LimitedAccessSubQuery
{
    /**
     * Returns pure SQL to get ID of all exports that are accessible to given user.
     *
     * An export may contain private cards, and its file can be downloaded by anybody knowing its filename, so it is
     * only accessible to the user who created it. Anonymous exports are not accessible at all, the client gets their
     * filename from the createExport mutation itself.
     */
    public function getAccessibleSubQuery(?\Ecodev\Felix\Model\User $user): string
    {
        if (!$user) {
            return '-1';
        }

        if ($user->getRole() === User::ROLE_ADMINISTRATOR) {
            return '';
        }

        $userId = $user->getId() ?? -1;

        return 'SELECT id FROM export WHERE owner_id = ' . $userId . ' OR creator_id = ' . $userId;
    }

    public function updateCards(Export $export, array $collectionIds, array $cardIds): int
    {
        // Inject all collections and cards picked one-by-one
        $this->insertMultiple($export, 'export_collection', 'collection_id', $collectionIds);
        $this->insertMultiple($export, 'export_card', 'card_id', $cardIds);

        $connection = $this->getEntityManager()->getConnection();
        $params = ['export' => $export->getId()];

        // "Expand" collections into cards
        $sql = <<<STRING
                REPLACE INTO export_card (export_id, card_id)
                SELECT export_id, card_id FROM card_collection
                INNER JOIN export_collection
                ON card_collection.collection_id = export_collection.collection_id
                AND export_collection.export_id = :export
            STRING;
        $connection->executeStatement($sql, $params);

        /** @var CardRepository $cardRepository */
        $cardRepository = $this->getEntityManager()->getRepository(Card::class);
        $cardSubQuery = $cardRepository->getAccessibleSubQuery(User::getCurrent());

        // Remove cards to which we have no access
        if ($cardSubQuery) {
            $connection->executeStatement('DELETE FROM export_card WHERE export_id = :export AND card_id NOT IN (' . $cardSubQuery . ')', $params);
        }

        $cardCount = $connection->fetchOne('SELECT COUNT(*) FROM export_card WHERE export_id = :export', $params);

        $params = [
            'export' => $export->getId(),
            'cardCount' => $cardCount,
        ];

        $connection->executeStatement('UPDATE export SET card_count = :cardCount WHERE id = :export', $params);

        return (int) $cardCount;
    }

    /**
     * Get the total size in bytes of the images of all the cards of the export.
     */
    public function getCardsFileSize(Export $export): int
    {
        $sql = <<<STRING
                SELECT COALESCE(SUM(card.file_size), 0) FROM export_card
                INNER JOIN card ON card.id = export_card.card_id
                WHERE export_card.export_id = :export
            STRING;

        return (int) $this->getEntityManager()->getConnection()->fetchOne($sql, ['export' => $export->getId()]);
    }

    private function insertMultiple(Export $export, string $table, string $field, array $ids): void
    {
        $connection = $this->getEntityManager()->getConnection();

        $cardValues = [];
        $exportId = $export->getId();
        foreach ($ids as $id) {
            $cardValues[] = '(' . $exportId . ', ' . $id . ')';
        }

        // Inject all card picked one-by-oneS
        if ($cardValues) {
            $values = implode(', ', $cardValues);
            $connection->executeStatement("REPLACE INTO $table (export_id, $field) VALUES $values");
        }
    }
}
