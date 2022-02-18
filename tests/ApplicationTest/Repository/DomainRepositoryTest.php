<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Domain;
use Application\Repository\DomainRepository;

class DomainRepositoryTest extends AbstractRepositoryTest
{
    private DomainRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Domain::class);
    }

    public function testGetFullNames(): void
    {
        $actual = $this->repository->getFullNames();
        $expected = [
            'Test domain 9000' => 9000,
            'Test domain 9001' => 9001,
        ];

        self::assertSame($expected, $actual);
    }
}
