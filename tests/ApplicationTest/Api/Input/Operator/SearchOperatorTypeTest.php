<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Operator;

use Application\Api\Input\Operator\SearchOperatorType;
use Application\Model\Card;
use Application\Model\DocumentType;
use Application\Model\User;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\Type;

class SearchOperatorTypeTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @dataProvider providerSearch
     */
    public function testSearch(string $class, string $term, string $expected): void
    {
        $operator = new SearchOperatorType(_types(), Type::string());

        $metadata = _em()->getClassMetadata($class);
        $unique = new UniqueNameFactory();
        $alias = 'a';
        $qb = _em()->getRepository($class)->createQueryBuilder($alias);
        $actual = $operator->getDqlCondition($unique, $metadata, $qb, $alias, 'non-used-field-name', ['value' => $term]);

        self::assertSame($expected, $actual);

        $joins = $qb->getDQLPart('join');
        if ($class === Card::class) {
            self::assertCount(3, $joins[$alias], 'Card should have new joins');
        } else {
            self::assertEmpty($joins, 'Non-card should not have any joins');
        }
    }

    public function providerSearch(): array
    {
        return [
            'simple' => [DocumentType::class, 'john', '(a.id LIKE :filter1 OR a.name LIKE :filter1)'],
            'search predefined fields' => [User::class, 'john', '(a.id LIKE :filter1 OR a.login LIKE :filter1 OR a.email LIKE :filter1 OR a.name LIKE :filter1)'],
            'search predefined joins' => [Card::class, 'foo', '(a.id LIKE :filter1 OR a.dating LIKE :filter1 OR a.addition LIKE :filter1 OR a.expandedName LIKE :filter1 OR a.material LIKE :filter1 OR a.technique LIKE :filter1 OR a.objectReference LIKE :filter1 OR a.corpus LIKE :filter1 OR a.street LIKE :filter1 OR a.locality LIKE :filter1 OR a.code LIKE :filter1 OR a.name LIKE :filter1 OR institution1.name LIKE :filter1 OR artist1.name LIKE :filter1 OR country1.name LIKE :filter1)'],
        ];
    }
}
