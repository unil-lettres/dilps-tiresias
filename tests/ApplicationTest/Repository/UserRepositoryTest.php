<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Enum\Site;
use Application\Model\User;
use Application\Repository\UserRepository;

class UserRepositoryTest extends AbstractRepository
{
    private UserRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(User::class);
    }

    public function testDeletedUserIsForgottenAsCreatorAndUpdater(): void
    {
        $connection = _em()->getConnection();
        $connection->executeStatement("INSERT INTO `user` (id, login, email, password, role, site) VALUES (1999, 'deleted', 'deleted@example.com', '', 'student', 'dilps')");
        $connection->executeStatement("INSERT INTO log (creator_id, level, message) VALUES (1999, 6, 'login')");
        $connection->executeStatement('UPDATE card SET updater_id = 1999 WHERE id = 6000');

        $connection->executeStatement('DELETE FROM `user` WHERE id = 1999');

        self::assertSame(0, (int) $connection->fetchOne('SELECT COUNT(*) FROM log WHERE creator_id = 1999'));
        self::assertNull($connection->fetchOne('SELECT updater_id FROM card WHERE id = 6000'));
        self::assertNotNull($connection->fetchOne('SELECT owner_id FROM card WHERE id = 6000'), 'owner is kept');
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

    public function testGetLoginPasswordOfAaiUser(): void
    {
        _em()->getConnection()->executeStatement("UPDATE `user` SET type = 'aai' WHERE id = 1000");

        self::assertNull($this->repository->getLoginPassword('administrator', 'administrator', Site::Dilps));
    }

    public function testGetLoginPasswordOfInactiveUser(): void
    {
        _em()->getConnection()->executeStatement("UPDATE `user` SET active_until = '2000-01-01' WHERE id = 1000");

        self::assertNull($this->repository->getLoginPassword('administrator', 'bar', Site::Dilps), 'wrong password must not tell that the account exists but is inactive');

        $this->expectExceptionMessage("Ce compte n'est plus actif");
        $this->repository->getLoginPassword('administrator', 'administrator', Site::Dilps);
    }
}
