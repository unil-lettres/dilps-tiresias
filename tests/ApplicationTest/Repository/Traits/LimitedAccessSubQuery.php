<?php

declare(strict_types=1);

namespace ApplicationTest\Repository\Traits;

use Application\DBAL\Types\SiteType;
use Application\Model\User;
use Application\Repository\UserRepository;
use Doctrine\ORM\EntityManager;

/**
 * Trait to test limited access sub queries.
 */
trait LimitedAccessSubQuery
{
    abstract public function getEntityManager(): EntityManager;

    /**
     * @dataProvider providerGetAccessibleSubQuery
     */
    public function testGetAccessibleSubQuery(?string $login, array $expected): void
    {
        /** @var UserRepository $userRepository */
        $userRepository = $this->getEntityManager()->getRepository(User::class);
        $user = $userRepository->getOneByLogin($login, SiteType::DILPS);
        $subQuery = $this->repository->getAccessibleSubQuery($user);

        if (!$subQuery) {
            $subQuery = $this->repository->getAllIdsQuery();
        }

        if ($subQuery === '-1') {
            $ids = [];
        } else {
            $ids = $this->getEntityManager()->getConnection()->executeQuery($subQuery)->fetchFirstColumn();
        }

        sort($ids);

        self::assertEquals($expected, $ids);
    }
}
