<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Card;
use Application\Model\User;
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

        $card->setFilename('test card.jpg');
        $this->getEntityManager()->persist($card);
        $this->getEntityManager()->flush();

        touch($card->getPath());
        self::assertFileExists($card->getPath(), 'test file must exist, because we just touch()ed it');

        $this->getEntityManager()->remove($card);
        $this->getEntityManager()->flush();
        self::assertFileNotExists($card->getPath(), 'test file must have been deleted when record was deleted');
    }

    public function testRandom(): void
    {
        User::setCurrent(_em()->getReference(User::class, 1000));
        $result = $this->repository->getFindAllQuery([], [['field' => 'random', 'order' => 'ASC']])->getQuery()->getResult();
        self::assertCount(14, $result);
    }
}
