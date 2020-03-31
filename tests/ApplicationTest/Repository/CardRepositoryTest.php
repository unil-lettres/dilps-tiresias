<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\DBAL\Types\SiteType;
use Application\Model\Card;
use Application\Repository\CardRepository;

/**
 * @group Repository
 */
class CardRepositoryTest extends AbstractRepositoryTest
{
    /**
     * @var CardRepository
     */
    private $repository;

    public function setUp(): void
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
        self::assertFileNotExists($card->getPath(), 'test file must have been deleted when record was deleted');
    }
}
