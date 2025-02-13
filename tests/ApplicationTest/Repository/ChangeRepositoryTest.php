<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Enum\ChangeType;
use Application\Enum\Site;
use Application\Model\Card;
use Application\Model\Change;
use Application\Model\User;
use Application\Repository\ChangeRepository;
use Application\Repository\UserRepository;

class ChangeRepositoryTest extends AbstractRepositoryTest
{
    private ChangeRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Change::class);
    }

    public function testGetOpenChange(): void
    {
        /** @var UserRepository $userRepository */
        $userRepository = _em()->getRepository(User::class);
        User::setCurrent($userRepository->getOneByLogin('administrator', Site::Dilps));
        $request = '';
        $creationSuggestion = _em()->getReference(Card::class, 6001);
        $updateSuggestion = _em()->getReference(Card::class, 6002);
        $deletionSuggestion = _em()->getReference(Card::class, 6000);

        // Can retrieve existing one
        self::assertNotNull($this->repository->getOrCreate(ChangeType::Create, $creationSuggestion, $request, Site::Dilps)->getId());
        self::assertNotNull($this->repository->getOrCreate(ChangeType::Update, $updateSuggestion, $request, Site::Dilps)->getId());
        self::assertNotNull($this->repository->getOrCreate(ChangeType::Delete, $deletionSuggestion, $request, Site::Dilps)->getId());

        // Can create new one
        self::assertNull($this->repository->getOrCreate(ChangeType::Update, $creationSuggestion, $request, Site::Dilps)->getId());
        self::assertNull($this->repository->getOrCreate(ChangeType::Delete, $creationSuggestion, $request, Site::Dilps)->getId());
        self::assertNull($this->repository->getOrCreate(ChangeType::Create, $updateSuggestion, $request, Site::Dilps)->getId());
        self::assertNull($this->repository->getOrCreate(ChangeType::Delete, $updateSuggestion, $request, Site::Dilps)->getId());
        self::assertNull($this->repository->getOrCreate(ChangeType::Create, $deletionSuggestion, $request, Site::Dilps)->getId());
        self::assertNull($this->repository->getOrCreate(ChangeType::Update, $deletionSuggestion, $request, Site::Dilps)->getId());
    }
}
