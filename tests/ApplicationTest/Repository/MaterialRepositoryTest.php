<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Material;
use Application\Repository\MaterialRepository;

class MaterialRepositoryTest extends AbstractRepositoryTest
{
    private MaterialRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Material::class);
    }

    public function testGetSelfAndDescendantsSubQuery(): void
    {
        $expected = [
            ['id' => 8000],
            ['id' => 8001],
        ];

        $sql = $this->repository->getSelfAndDescendantsSubQuery(8000);
        $actual = _em()->getConnection()->fetchAllAssociative($sql);
        self::assertSame($expected, $actual);
    }
}
