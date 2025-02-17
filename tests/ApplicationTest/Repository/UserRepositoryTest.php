<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Enum\Site;
use Application\Model\User;
use Application\Repository\UserRepository;

class UserRepositoryTest extends AbstractRepositoryTest
{
    private UserRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(User::class);
    }

    public function testGetLoginPassword(): void
    {
        self::assertNull($this->repository->getLoginPassword('foo', 'bar', Site::Dilps), 'wrong user');
        self::assertNull($this->repository->getLoginPassword('administrator', 'bar', Site::Dilps), 'wrong password');

        $user = $this->repository->getLoginPassword('administrator', 'administrator', Site::Dilps);
        self::assertNotNull($user);
        self::assertSame(1000, $user->getId());

        $hash = _em()->getConnection()->executeQuery('SELECT password FROM `user` WHERE id = 1000')->fetchOne();
        self::assertStringStartsWith('$', $hash, 'password should have been re-hashed automatically');
        self::assertNotSame(md5('administrator'), $hash, 'password should have been re-hashed automatically');
    }
}
