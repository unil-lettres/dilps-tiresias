<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Operator;

use Application\Api\Input\Operator\ArtistOrTechniqueAuthorOperatorType;
use Application\Model\Card;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\Type;

class ArtistOrTechniqueAuthorOperatorTypeTest extends \PHPUnit\Framework\TestCase
{
    public function testSearch(): void
    {
        $operator = new ArtistOrTechniqueAuthorOperatorType(_types(), Type::string());

        $metadata = _em()->getClassMetadata(Card::class);
        $unique = new UniqueNameFactory();
        $alias = 'a';
        $qb = _em()->getRepository(Card::class)->createQueryBuilder($alias);
        $actual = $operator->getDqlCondition($unique, $metadata, $qb, $alias, 'non-used-field-name', ['value' => 'foo']);

        $expected = '(a.techniqueAuthor LIKE :filter1 OR artist1.name LIKE :filter1)';
        self::assertSame($expected, $actual);

        $joins = $qb->getDQLPart('join');
        self::assertCount(1, $joins[$alias], 'Card should have new joins');
    }
}
