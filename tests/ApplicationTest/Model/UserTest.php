<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\DBAL\Types\SiteType;
use Application\Model\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    protected function tearDown(): void
    {
        User::setCurrent(null);
    }

    public function testGetGlobalPermissions(): void
    {
        $user = new User();
        $user->setSite(SiteType::DILPS);
        $actual = $user->getGlobalPermissions();
        $expected = [
            'artist' => [
                'create' => true,
            ],
            'card' => [
                'create' => true,
            ],
            'change' => [
                'create' => true,
            ],
            'collection' => [
                'create' => true,
            ],
            'country' => [
                'create' => false,
            ],
            'dating' => [
                'create' => false,
            ],
            'institution' => [
                'create' => true,
            ],
            'tag' => [
                'create' => true,
            ],
            'user' => [
                'create' => false,
            ],
            'domain' => [
                'create' => false,
            ],
            'documentType' => [
                'create' => false,
            ],
            'news' => [
                'create' => false,
            ],
            'period' => [
                'create' => false,
            ],
            'material' => [
                'create' => false,
            ],
            'antiqueName' => [
                'create' => false,
            ],
        ];

        self::assertEquals($expected, $actual);

        $expectedForAdmin = [
            'artist' => [
                'create' => true,
            ],
            'card' => [
                'create' => true,
            ],
            'change' => [
                'create' => true,
            ],
            'collection' => [
                'create' => true,
            ],
            'country' => [
                'create' => false,
            ],
            'dating' => [
                'create' => false,
            ],
            'institution' => [
                'create' => true,
            ],
            'tag' => [
                'create' => true,
            ],
            'user' => [
                'create' => true,
            ],
            'domain' => [
                'create' => true,
            ],
            'documentType' => [
                'create' => true,
            ],
            'news' => [
                'create' => true,
            ],
            'period' => [
                'create' => true,
            ],
            'material' => [
                'create' => true,
            ],
            'antiqueName' => [
                'create' => true,
            ],
        ];

        User::setCurrent($user);
        self::assertSame($user, User::getCurrent());

        $admin = new User(User::ROLE_ADMINISTRATOR);
        $admin->setSite(SiteType::DILPS);
        $actualForAdmin = $admin->getGlobalPermissions();

        self::assertEquals($expectedForAdmin, $actualForAdmin);
        self::assertSame($user, User::getCurrent());
        self::assertNotEquals($expectedForAdmin, $expected);
    }

    /**
     * @dataProvider providerSetRole
     */
    public function testSetRole(string $currentRole, string $oldRole, string $newRole, ?string $exception): void
    {
        if ($currentRole !== User::ROLE_ANONYMOUS) {
            $currentUser = new User($currentRole);
            User::setCurrent($currentUser);
        }

        $user2 = new User($oldRole);

        if ($exception) {
            $this->expectExceptionMessage($exception);
        }

        $user2->setRole($newRole);
        self::assertSame($newRole, $user2->getRole());
    }

    public function providerSetRole(): array
    {
        return [
            [User::ROLE_ANONYMOUS, User::ROLE_STUDENT, User::ROLE_JUNIOR, 'anonymous is not allowed to change role to junior'],

            [User::ROLE_STUDENT, User::ROLE_STUDENT, User::ROLE_STUDENT, null],
            [User::ROLE_STUDENT, User::ROLE_STUDENT, User::ROLE_JUNIOR, 'student is not allowed to change role to junior'],

            [User::ROLE_JUNIOR, User::ROLE_STUDENT, User::ROLE_JUNIOR, null],
            [User::ROLE_JUNIOR, User::ROLE_JUNIOR, User::ROLE_JUNIOR, null],
            'cannot promote higher than us' => [User::ROLE_JUNIOR, User::ROLE_JUNIOR, User::ROLE_SENIOR, 'junior is not allowed to change role to senior'],
            'cannot demote' => [User::ROLE_JUNIOR, User::ROLE_SENIOR, User::ROLE_JUNIOR, 'junior is not allowed to change role to junior'],

            [User::ROLE_ADMINISTRATOR, User::ROLE_JUNIOR, User::ROLE_SENIOR, null],
            [User::ROLE_ADMINISTRATOR, User::ROLE_JUNIOR, User::ROLE_ADMINISTRATOR, null],
            [User::ROLE_ADMINISTRATOR, User::ROLE_ADMINISTRATOR, User::ROLE_STUDENT, null],
        ];
    }

    public function testSetPassword(): void
    {
        $user = new User();
        self::assertSame('', $user->getPassword(), 'should have no password at first');

        $user->setPassword('12345');
        $actual1 = $user->getPassword();
        self::assertNotSame('', $actual1, 'should be able to change password ');
        self::assertTrue(password_verify('12345', $actual1), 'password must have been hashed');

        $user->setPassword('');
        $actual2 = $user->getPassword();
        self::assertSame($actual1, $actual2, 'should ignore empty password');

        $user->setPassword('money');
        $actual3 = $user->getPassword();
        self::assertNotSame($actual1, $actual3, 'should be able to change to something else');
        self::assertTrue(password_verify('money', $actual3), 'password must have been hashed again');
    }
}
