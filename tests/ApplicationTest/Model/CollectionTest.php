<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Enum\CollectionVisibility;
use Application\Model\Collection;
use Application\Model\User;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class CollectionTest extends TestCase
{
    protected function tearDown(): void
    {
        User::setCurrent(null);
    }

    public function testChildCollectionsRelation(): void
    {
        $parent = new Collection();
        $child = new Collection();
        self::assertCount(0, $parent->getChildren());

        $child->setParent($parent);
        self::assertCount(1, $parent->getChildren());
        self::assertSame($child, $parent->getChildren()[0]);

        $otherParent = new Collection();
        self::assertCount(0, $otherParent->getChildren());

        $child->setParent($otherParent);
        self::assertCount(0, $parent->getChildren());
        self::assertCount(1, $otherParent->getChildren());
        self::assertSame($child, $otherParent->getChildren()[0]);

        $child->setParent(null);
        self::assertCount(0, $parent->getChildren());
        self::assertCount(0, $otherParent->getChildren());
    }

    public function testCannotCreateCyclicHierarchy(): void
    {
        $parent = new Collection();
        $child = new Collection();
        $grandChild = new Collection();

        $child->setParent($parent);
        $grandChild->setParent($child);

        self::expectException(InvalidArgumentException::class);
        self::expectExceptionMessage('Parent object is invalid because it would create a cyclic hierarchy');
        $parent->setParent($grandChild);
    }

    public function testCannotCreateCyclicHierarchyAsMyOwnParent(): void
    {
        $collection = new Collection();

        self::expectException(InvalidArgumentException::class);
        self::expectExceptionMessage('An object cannot be his own parent');
        $collection->setParent($collection);
    }

    public function testUserCannotBeBothResponsibleAndSubscriber(): void
    {
        $collection = new Collection();
        $user = new User();

        $collection->addSubscriber($user);
        self::assertCount(1, $collection->getSubscribers());
        self::assertCount(0, $collection->getResponsibles());

        // Promoting the subscriber to responsible must remove the subscription
        $collection->addResponsible($user);
        self::assertCount(1, $collection->getResponsibles());
        self::assertCount(0, $collection->getSubscribers(), 'a responsible must not remain a subscriber');

        // But adding a responsible as subscriber must not demote them, because responsibles may add subscribers
        $this->expectExceptionMessage('Cet utilisateur est déjà responsable de la collection.');
        $collection->addSubscriber($user);
    }

    #[DataProvider('providerSetVisibility')]
    public function testSetVisibility(string $role, CollectionVisibility $previous, CollectionVisibility $next, bool $shouldThrow): void
    {
        $collection = new Collection();
        $collection->setVisibility($previous);

        User::setCurrent(new User($role));

        if ($shouldThrow) {
            $this->expectExceptionMessage('Only seniors, majors and administrators can make a collection visible to others than its members');
        }

        $collection->setVisibility($next);
        self::assertSame($next, $collection->getVisibility());
    }

    public static function providerSetVisibility(): iterable
    {
        yield 'student cannot make public' => [User::ROLE_STUDENT, CollectionVisibility::Private, CollectionVisibility::Member, true];
        yield 'junior cannot make public' => [User::ROLE_JUNIOR, CollectionVisibility::Private, CollectionVisibility::Member, true];
        yield 'junior cannot make visible to administrators' => [User::ROLE_JUNIOR, CollectionVisibility::Private, CollectionVisibility::Administrator, true];
        yield 'junior cannot change between non-private' => [User::ROLE_JUNIOR, CollectionVisibility::Member, CollectionVisibility::Administrator, true];
        yield 'junior can keep public' => [User::ROLE_JUNIOR, CollectionVisibility::Member, CollectionVisibility::Member, false];
        yield 'junior can make private' => [User::ROLE_JUNIOR, CollectionVisibility::Member, CollectionVisibility::Private, false];
        yield 'senior can make public' => [User::ROLE_SENIOR, CollectionVisibility::Private, CollectionVisibility::Member, false];
        yield 'major can make public' => [User::ROLE_MAJOR, CollectionVisibility::Private, CollectionVisibility::Member, false];
        yield 'administrator can make visible to administrators' => [User::ROLE_ADMINISTRATOR, CollectionVisibility::Private, CollectionVisibility::Administrator, false];
    }
}
