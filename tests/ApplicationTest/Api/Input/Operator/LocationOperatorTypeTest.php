<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Operator;

use Application\Api\Input\Operator\LocationOperatorType;
use Application\Enum\Site;
use Application\Model\Card;
use Application\Model\User;
use ApplicationTest\Traits\TestWithTransaction;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\Type;
use PHPUnit\Framework\TestCase;

class LocationOperatorTypeTest extends TestCase
{
    use TestWithTransaction;

    public function testFindsCardCreatedAfterCardsWithoutLocation(): void
    {
        User::setCurrent(_em()->getRepository(User::class)->getOneByLogin('administrator', Site::Tiresias));

        $withoutLocation = new Card('without location');
        $withoutLocation->setSite(Site::Tiresias);
        _em()->persist($withoutLocation);

        $card = new Card('with location');
        $card->setSite(Site::Tiresias);
        $card->setLongitude(3.1234);
        $card->setLatitude(43.4321);
        _em()->persist($card);
        _em()->flush();

        $operator = new LocationOperatorType(_types(), Type::string());
        $metadata = _em()->getClassMetadata(Card::class);
        $alias = 'a';
        $qb = _em()->getRepository(Card::class)->createQueryBuilder($alias);
        $condition = $operator->getDqlCondition(new UniqueNameFactory(), $metadata, $qb, $alias, 'non-used-field-name', [
            'longitude' => 3.1234,
            'latitude' => 43.4321,
            'distance' => 200.0,
        ]);
        $qb->andWhere($condition);

        self::assertSame([$card], $qb->getQuery()->getResult());
    }
}
