<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\DBAL\Types\SiteType;
use Application\Model\Export;
use Application\Model\User;
use Application\Repository\ExportRepository;
use Application\Repository\UserRepository;

class ExportRepositoryTest extends AbstractRepositoryTest
{
    private ExportRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = $this->getEntityManager()->getRepository(Export::class);
    }

    public function testUpdateCards(): void
    {
        /** @var UserRepository $userRepository */
        $userRepository = _em()->getRepository(User::class);
        User::setCurrent($userRepository->getOneByLogin('administrator', SiteType::DILPS));

        /** @var Export $export1 */
        $export1 = $this->getEntityManager()->getReference(Export::class, 14000);

        /** @var Export $export2 */
        $export2 = $this->getEntityManager()->getReference(Export::class, 14001);

        self::assertSame($export1->getCardCount(), $this->getCardCount($export1), 'fixture should be coherent');
        self::assertSame($export2->getCardCount(), $this->getCardCount($export2), 'fixture should be coherent');

        self::assertSame(1, $this->repository->updateCards($export1, [], [6000]), 'should not change with same values');

        self::assertSame(2, $this->repository->updateCards($export2, [2001], []), 'should not change with same values');

        self::assertSame(3, $this->repository->updateCards($export1, [], [6000, 6001, 6003]), 'can add more cards to hand-picked cards');

        self::assertSame(4, $this->repository->updateCards($export2, [2001], [6007, 6008]), 'can add more cards to collection');
    }

    private function getCardCount(Export $export): int
    {
        $connection = $this->getEntityManager()->getConnection();
        $cardCount = $connection->fetchOne('SELECT COUNT(*) FROM export_card WHERE export_id = :export', ['export' => $export->getId()]);

        return (int) $cardCount;
    }
}
