<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Enum\Site;
use Application\Model\Institution;
use Application\Repository\InstitutionRepository;

class InstitutionRepositoryTest extends AbstractRepositoryTest
{
    private InstitutionRepository  $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Institution::class);
    }

    public function testGetOrCreateByName(): void
    {
        $institution = $this->repository->getOrCreateByName('Test institution 5000', Site::Dilps);
        self::assertSame('Test institution 5000', $institution->getName());
        self::assertSame(5000, $institution->getId());

        $institution = $this->repository->getOrCreateByName('Test institution 5000    ', Site::Dilps);
        self::assertSame('Test institution 5000', $institution->getName(), 'whitespace should not matter');
        self::assertSame(5000, $institution->getId());

        $institution = $this->repository->getOrCreateByName('Test foo', Site::Dilps);
        self::assertSame('Test foo', $institution->getName());
        self::assertNull($institution->getId());

        $institution = $this->repository->getOrCreateByName('Test foo    ', Site::Dilps);
        self::assertSame('Test foo', $institution->getName(), 'whitespace should not matter');
        self::assertNull($institution->getId());

        $institution = $this->repository->getOrCreateByName('    ', Site::Dilps);
        self::assertNull($institution, 'should not create with empty name');

        $institution = $this->repository->getOrCreateByName(null, Site::Dilps);
        self::assertNull($institution, 'should not create with null name');

        $institution = $this->repository->getOrCreateByName('Test institution 5000', Site::Tiresias);
        self::assertSame('Test institution 5000', $institution->getName());
        self::assertSame(Site::Tiresias, $institution->getSite());
        self::assertNull($institution->getId(), 'not the same as DILPS one');
    }
}
