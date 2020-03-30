<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Operator;

use Application\Api\Input\Operator\DatingYearRangeOperatorType;
use Application\Model\Card;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\Type;

class DatingYearRangeOperatorTypeTest extends \PHPUnit\Framework\TestCase
{
    public function testSearch(): void
    {
        $operator = new DatingYearRangeOperatorType(_types(), Type::string());

        $metadata = _em()->getClassMetadata(Card::class);
        $unique = new UniqueNameFactory();
        $alias = 'a';
        $qb = _em()->getRepository(Card::class)->createQueryBuilder($alias);
        $actual = $operator->getDqlCondition($unique, $metadata, $qb, $alias, 'non-used-field-name', ['from' => 1990, 'to' => 2000]);

        $expected = '((:filter1 >= dating1.from AND :filter1 <= dating1.to) OR (:filter2 <= dating1.to AND :filter2 >= dating1.from) OR (:filter1 <= dating1.from AND :filter2 >= dating1.to))';
        self::assertSame($expected, $actual);

        $joins = $qb->getDQLPart('join');
        self::assertCount(1, $joins[$alias], 'Card should have new joins');
    }
}
