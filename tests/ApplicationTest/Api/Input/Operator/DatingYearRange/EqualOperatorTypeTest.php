<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Operator\DatingYearRange;

use Application\Api\Input\Operator\DatingYearRange\EqualOperatorType;
use Application\Model\Card;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\Type;

class EqualOperatorTypeTest extends \PHPUnit\Framework\TestCase
{
    public function testSearch(): void
    {
        $operator = new EqualOperatorType(_types(), Type::string());

        $metadata = _em()->getClassMetadata(Card::class);
        $unique = new UniqueNameFactory();
        $alias = 'a';
        $qb = _em()->getRepository(Card::class)->createQueryBuilder($alias);
        $actual = $operator->getDqlCondition($unique, $metadata, $qb, $alias, 'non-used-field-name', ['value' => 2000]);

        $expected = 'dating1.from <= :filter1 AND :filter2 <= dating1.to';
        self::assertSame($expected, $actual);

        $joins = $qb->getDQLPart('join');
        self::assertCount(1, $joins[$alias], 'Card should have new joins');
    }
}
