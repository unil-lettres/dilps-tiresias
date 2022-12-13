<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Tag;
use Application\Repository\TagRepository;

class TagRepositoryTest extends AbstractRepositoryTest
{
    private TagRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Tag::class);
    }

    public function testGetSelfAndDescendantsSubQuery(): void
    {
        $expected = [
            ['id' => 4000],
            ['id' => 4001],
        ];

        $sql = $this->repository->getSelfAndDescendantsSubQuery(4000);
        $actual = _em()->getConnection()->fetchAllAssociative($sql);
        self::assertSame($expected, $actual);

        $expected = [
            ['id' => 4003],
        ];

        $sql = $this->repository->getSelfAndDescendantsSubQuery(4003);
        $actual = _em()->getConnection()->fetchAllAssociative($sql);
        self::assertSame($expected, $actual);
    }
}
