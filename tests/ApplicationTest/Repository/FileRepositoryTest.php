<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\File;
use Application\Repository\FileRepository;
use ApplicationTest\Repository\Traits\LimitedAccessSubQuery;

class FileRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    private FileRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(File::class);
    }

    public function providerGetAccessibleSubQuery(): iterable
    {
        yield ['anonymous', []];
        yield ['student', [13000]];
        yield ['junior', []];
        yield ['senior', []];
        yield ['administrator', [13000]];
    }
}
