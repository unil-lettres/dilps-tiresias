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

    public function testCardRelation(): void
    {
        $collection = new Collection();
        self::assertCount(0, $collection->getCards(), 'should have no cards');

        $card = new Card();
        self::assertCount(0, $card->getCollections(), 'should belong to no collection');

        $collection->addCard($card);
        self::assertCount(1, $card->getCollections(), 'should belong to the collection');
        self::assertSame($collection, $card->getCollections()->first(), 'should belong to the same collection');
        self::assertCount(1, $collection->getCards(), 'should have the added card');
        self::assertSame($card, $collection->getCards()->first(), 'should be able to retrieve added card');

        $card2 = new Card();
        $collection->addCard($card2);
        self::assertCount(2, $collection->getCards(), 'should be able to add second card');

        $collection->removeCard($card);
        self::assertCount(0, $card->getCollections(), 'should not belong to any collection anymore');
        self::assertCount(1, $collection->getCards(), 'should be able to remove first card');
        self::assertSame($card2, $collection->getCards()->first(), 'should be have only second card left');
    }
}
