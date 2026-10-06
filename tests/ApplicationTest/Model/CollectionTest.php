<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Collection;
use Application\Model\User;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class CollectionTest extends TestCase
{
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
}
