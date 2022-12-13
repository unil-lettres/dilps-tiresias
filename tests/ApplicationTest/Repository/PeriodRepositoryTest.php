<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Period;
use Application\Repository\PeriodRepository;

class PeriodRepositoryTest extends AbstractRepositoryTest
{
    private PeriodRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Period::class);
    }

    public function testGetSelfAndDescendantsSubQuery(): void
    {
        $expected = [
            ['id' => 7000],
            ['id' => 7001],
        ];

        $sql = $this->repository->getSelfAndDescendantsSubQuery(7000);
        $actual = _em()->getConnection()->fetchAllAssociative($sql);
        self::assertSame($expected, $actual);
    }
}
