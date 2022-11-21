<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\DBAL\Types\SiteType;
use Application\Model\Card;
use Application\Model\Export;
use Application\Repository\CardRepository;

class CardRepositoryTest extends AbstractRepositoryTest
{
    private CardRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Card::class);
    }

    public function testCardOnDiskIsDeletedWhenRecordInDbIsDeleted(): void
    {
        $card = new Card('test card');

        $card->setSite(SiteType::DILPS);
        $card->setFilename('test card.jpg');
        $this->getEntityManager()->persist($card);
        $this->getEntityManager()->flush();

        touch($card->getPath());
        self::assertFileExists($card->getPath(), 'test file must exist, because we just touch()ed it');

        $this->getEntityManager()->remove($card);
        $this->getEntityManager()->flush();
        self::assertFileDoesNotExist($card->getPath(), 'test file must have been deleted when record was deleted');
    }

    public function testGetExportCards(): void
    {
        $export1 = $this->getEntityManager()->getReference(Export::class, 14000);
        self::assertCount(1, $this->repository->getExportCards($export1, 0));
        self::assertCount(0, $this->repository->getExportCards($export1, 6000));

        $export2 = $this->getEntityManager()->getReference(Export::class, 14001);
        self::assertCount(2, $this->repository->getExportCards($export2, 0));
        self::assertCount(1, $this->repository->getExportCards($export2, 6001));
        self::assertCount(0, $this->repository->getExportCards($export2, 6002));
    }

    public function testCachedArtistNames(): void
    {
        $this->assertArtistNames('Test artist 3000
Test artist 3001');

        $connection = $this->getEntityManager()->getConnection();
        $connection->executeStatement("UPDATE artist SET name = 'foo' WHERE id = 3000");
        $this->assertArtistNames('foo
Test artist 3001');

        $connection->executeStatement('DELETE FROM card_artist WHERE artist_id = 3000');
        $this->assertArtistNames('Test artist 3001');

        $connection->executeStatement('INSERT INTO card_artist (card_id, artist_id) VALUES (6000, 3000)');
        $this->assertArtistNames('foo
Test artist 3001');

        $connection->executeStatement('DELETE FROM artist WHERE id = 3001');
        $this->assertArtistNames('foo');
    }

    private function assertArtistNames(string $name): void
    {
        self::assertSame($name, $this->getEntityManager()->getConnection()->fetchOne('SELECT cached_artist_names FROM card WHERE id = 6000'));
    }
}
