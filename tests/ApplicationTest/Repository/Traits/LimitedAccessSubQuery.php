<?php

declare(strict_types=1);

namespace ApplicationTest\Repository\Traits;

use Application\DBAL\Types\SiteType;
use Application\Model\User;
use Application\Repository\UserRepository;
use PDO;

/**
 * Trait to test limited access sub queries
 */
trait LimitedAccessSubQuery
{
    /**
     * @dataProvider providerGetAccessibleSubQuery
     */
    public function testGetAccessibleSubQuery(?string $login, array $expected): void
    {
        /** @var UserRepository $userRepository */
        $userRepository = _em()->getRepository(User::class);
        $user = $userRepository->getOneByLogin($login, SiteType::DILPS);
        $subQuery = $this->repository->getAccessibleSubQuery($user);

        if ($subQuery === '-1') {
            $ids = [];
        } else {
            $ids = _em()->getConnection()->executeQuery($subQuery)->fetchAll(PDO::FETCH_COLUMN);
        }

        sort($ids);

        self::assertEquals($expected, $ids);
    }
}
