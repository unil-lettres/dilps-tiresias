<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Enum\Site;
use Application\Model\Statistic;
use Application\Model\User;
use Application\Repository\StatisticRepository;
use InvalidArgumentException;

class StatisticRepositoryTest extends AbstractRepositoryTest
{
    private StatisticRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Statistic::class);
    }

    /**
     * @dataProvider providerGetExtraStatistics
     */
    public function testGetExtraStatistics(Site $site, string $poeriod, ?int $userId): void
    {
        $user = $userId ? $this->getEntityManager()->getRepository(User::class)->getOneById($userId) : null;
        $actual = $this->repository->getExtraStatistics($site, $poeriod, $user);

        $keys = ['cardCreation', 'cardUpdate', 'userCreation', 'userUpdate'];
        self::assertSame($keys, array_keys($actual));
        foreach ($keys as $key) {
            $one = $actual[$key];
            self::assertSame(['tables', 'chart'], array_keys($one));

            foreach ($one['tables'] as $table) {
                self::assertSame(['name', 'rows'], array_keys($table));

                foreach ($table['rows'] as $row) {
                    self::assertSame(['name', 'value'], array_keys($row));
                }
            }

            self::assertSame(['name', 'categories', 'series'], array_keys($one['chart']));

            foreach ($one['chart']['series'] as $serie) {
                self::assertSame(['name', 'data'], array_keys($serie));
            }
        }
    }

    public function providerGetExtraStatistics(): iterable
    {
        yield [Site::Dilps, 'month', null];
        yield [Site::Dilps, 'all', null];
        yield [Site::Dilps, '2019', null];
        yield [Site::Tiresias, 'month', 1000];
        yield [Site::Tiresias, 'all', 1000];
        yield [Site::Tiresias, '2019', 1000];
    }

    /**
     * @dataProvider providerGetExtraStatisticsException
     */
    public function testGetExtraStatisticsException(Site $site, string $period, ?int $userId): void
    {
        $this->expectException(InvalidArgumentException::class);

        $user = $userId ? $this->getEntityManager()->getRepository(User::class)->getOneById($userId) : null;
        $this->repository->getExtraStatistics($site, $period, $user);
    }

    public function providerGetExtraStatisticsException(): iterable
    {
        yield [Site::Tiresias, '20asd\'1"9', 1000];
        yield [Site::Tiresias, 'bbb', 1000];
    }
}
