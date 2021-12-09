<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Card;
use Application\Model\Dating;
use Cake\Chronos\Chronos;
use DateTimeZone;
use PHPUnit\Framework\TestCase;

class DatingTest extends TestCase
{
    public function testFrom(): void
    {
        $dating = new Dating();
        $d1 = new Chronos('now', new DateTimeZone('UTC'));
        $d1 = $d1->setDate(-1200, 2, 3)->setTime(0, 0, 0, 0);
        $dating->setFrom($d1);
        $d2 = $dating->getFrom();

        self::assertNotSame($d1, $d2);
        self::assertEquals($d1, $d2);
    }

    public function testTo(): void
    {
        $dating = new Dating();
        $d1 = new Chronos('2010-02-03', new DateTimeZone('UTC'));
        $dating->setTo($d1);
        $d2 = $dating->getTo();

        self::assertNotSame($d1, $d2);
        self::assertEquals($d1, $d2);
    }

    public function testDatingRelation(): void
    {
        $card = new Card();
        self::assertCount(0, $card->getDatings(), 'should have no datings');

        $dating = new Dating();
        $dating->setCard($card);

        self::assertSame($card, $dating->getCard(), 'should belong to the card');
        self::assertCount(1, $card->getDatings(), 'should have the added dating');
        self::assertSame($dating, $card->getDatings()->first(), 'should be able to retrieve added dating');

        $dating->setCard($card);
        self::assertSame($card, $dating->getCard(), 'should still belong to exactly 1 card');
        self::assertCount(1, $card->getDatings(), 'should still have the same unique dating');

        $dating2 = new Dating();
        $dating2->setCard($card);
        self::assertCount(2, $card->getDatings(), 'should be able to add second dating');

        $dating->setCard(new Card());
        self::assertCount(1, $card->getDatings(), 'should be able to remove first dating');
        self::assertSame($dating2, $card->getDatings()->first(), 'should be have only second dating left');
    }
}
