<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\DBAL\Types\SiteType;
use Application\Model\Card;
use Application\Model\Change;
use Application\Model\User;
use Application\Repository\ChangeRepository;

/**
 * @group Repository
 */
class ChangeRepositoryTest extends AbstractRepositoryTest
{
    /**
     * @var ChangeRepository
     */
    private $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Change::class);
    }

    public function testGetOpenChange(): void
    {
        User::setCurrent(_em()->getRepository(User::class)->getOneByLogin('administrator', SiteType::DILPS));
        $request = '';
        $creationSuggestion = _em()->getReference(Card::class, 6001);
        $updateSuggestion = _em()->getReference(Card::class, 6002);
        $deletionSuggestion = _em()->getReference(Card::class, 6000);

        // Can retrieve existing one
        self::assertNotNull($this->repository->getOrCreate(Change::TYPE_CREATE, $creationSuggestion, $request, 'dilps')->getId());
        self::assertNotNull($this->repository->getOrCreate(Change::TYPE_UPDATE, $updateSuggestion, $request, 'dilps')->getId());
        self::assertNotNull($this->repository->getOrCreate(Change::TYPE_DELETE, $deletionSuggestion, $request, 'dilps')->getId());

        // Can create new one
        self::assertNull($this->repository->getOrCreate(Change::TYPE_UPDATE, $creationSuggestion, $request, 'dilps')->getId());
        self::assertNull($this->repository->getOrCreate(Change::TYPE_DELETE, $creationSuggestion, $request, 'dilps')->getId());
        self::assertNull($this->repository->getOrCreate(Change::TYPE_CREATE, $updateSuggestion, $request, 'dilps')->getId());
        self::assertNull($this->repository->getOrCreate(Change::TYPE_DELETE, $updateSuggestion, $request, 'dilps')->getId());
        self::assertNull($this->repository->getOrCreate(Change::TYPE_CREATE, $deletionSuggestion, $request, 'dilps')->getId());
        self::assertNull($this->repository->getOrCreate(Change::TYPE_UPDATE, $deletionSuggestion, $request, 'dilps')->getId());
    }
}
