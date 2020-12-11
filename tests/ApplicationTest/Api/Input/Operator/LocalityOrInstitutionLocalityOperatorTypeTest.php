<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Operator;

use Application\Api\Input\Operator\LocalityOrInstitutionLocalityOperatorType;
use Application\Model\Card;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\Type;

class LocalityOrInstitutionLocalityOperatorTypeTest extends \PHPUnit\Framework\TestCase
{
    public function testSearch(): void
    {
        $operator = new LocalityOrInstitutionLocalityOperatorType(_types(), Type::string());

        $metadata = _em()->getClassMetadata(Card::class);
        $unique = new UniqueNameFactory();
        $alias = 'a';
        $qb = _em()->getRepository(Card::class)->createQueryBuilder($alias);
        $actual = $operator->getDqlCondition($unique, $metadata, $qb, $alias, 'non-used-field-name', ['value' => 'foo']);

        $expected = '(a.locality LIKE :filter1 OR institution1.locality LIKE :filter1)';
        self::assertSame($expected, $actual);

        $joins = $qb->getDQLPart('join');
        self::assertCount(1, $joins[$alias], 'Card should have new joins');
    }
}
