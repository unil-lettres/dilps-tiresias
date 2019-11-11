<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Statistic;
use Application\Model\User;
use Application\Repository\StatisticRepository;

class StatisticRepositoryTest extends AbstractRepositoryTest
{
    /**
     * @var StatisticRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Statistic::class);
    }

    /**
     * @dataProvider providerGetExtraStatistics
     */
    public function testGetExtraStatistics(string $site, string $poeriod, ?int $userId): void
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

    public function providerGetExtraStatistics(): array
    {
        return [
            ['dilps', 'month', null],
            ['dilps', 'all', null],
            ['dilps', '2019', null],
            ['tiresias', 'month', 1000],
            ['tiresias', 'all', 1000],
            ['tiresias', '2019', 1000],
            ['tir\'asd"esias', '20asd\'1"9', 1000],
        ];
    }
}
