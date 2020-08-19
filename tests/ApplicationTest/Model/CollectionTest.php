<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Card;
use Application\Model\Collection;
use InvalidArgumentException;

class CollectionTest extends \PHPUnit\Framework\TestCase
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
        $parent->setParent($grandChild);
    }
}
