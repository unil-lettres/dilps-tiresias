<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Operator;

use Application\Api\Input\Operator\LocalityOrInstitutionLocalityOperatorType;
use Application\Model\Card;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\Type;
use PHPUnit\Framework\TestCase;

class LocalityOrInstitutionLocalityOperatorTypeTest extends TestCase
{
    public function testSearch(): void
    {
        $operator = new LocalityOrInstitutionLocalityOperatorType(_types(), Type::string());

        $metadata = _em()->getClassMetadata(Card::class);
        $unique = new UniqueNameFactory();
        $alias = 'a';
        $qb = _em()->getRepository(Card::class)->createQueryBuilder($alias);
        $actual = $operator->getDqlCondition($unique, $metadata, $qb, $alias, 'non-used-field-name', ['value' => 'foo']);

        $expected = '( (MATCH (a.locality) AGAINST (:filter1 IN BOOLEAN MODE) > 0) )';
        self::assertSame($expected, $actual);
        self::assertEmpty($qb->getDQLPart('join'), 'institution must be searched without join');
    }
}
