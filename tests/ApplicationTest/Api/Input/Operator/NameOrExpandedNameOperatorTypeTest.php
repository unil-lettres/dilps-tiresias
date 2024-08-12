<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Operator;

use Application\Api\Input\Operator\NameOrExpandedNameOperatorType;
use Application\Model\Card;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\Type;

class NameOrExpandedNameOperatorTypeTest extends \PHPUnit\Framework\TestCase
{
    public function testSearch(): void
    {
        $operator = new NameOrExpandedNameOperatorType(_types(), Type::string());

        $metadata = _em()->getClassMetadata(Card::class);
        $unique = new UniqueNameFactory();
        $alias = 'a';
        $qb = _em()->getRepository(Card::class)->createQueryBuilder($alias);
        $actual = $operator->getDqlCondition($unique, $metadata, $qb, $alias, 'non-used-field-name', ['value' => 'foo']);

        $expected = '( (MATCH (a.expandedName,a.name) AGAINST (:filter1 IN BOOLEAN MODE) > 0) )';
        self::assertSame($expected, $actual);

        $joins = $qb->getDQLPart('join');
        self::assertEmpty($joins, 'should not have any joins');
    }
}
