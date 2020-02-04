<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Operator;

use Application\Api\Input\Operator\SearchOperatorType;
use Application\Model\Artist;
use Application\Model\Card;
use Application\Model\User;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\Type;

class SearchOperatorTypeTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @dataProvider providerSearch
     *
     * @param string $class
     * @param string $term
     * @param string $expected
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
            self::assertCount(2, $joins[$alias], 'Card should have new joins');
        } else {
            self::assertEmpty($joins, 'Non-card should not have any joins');
        }
    }

    public function providerSearch(): array
    {
        return [
            'simple' => [Artist::class, 'john', '((a.id LIKE :filter1 OR a.name LIKE :filter1))'],
            'split words' => [Artist::class, 'john doe', '((a.id LIKE :filter1 OR a.name LIKE :filter1) AND (a.id LIKE :filter2 OR a.name LIKE :filter2))'],
            'search predefined fields' => [User::class, 'john', '((a.id LIKE :filter1 OR a.login LIKE :filter1 OR a.email LIKE :filter1 OR a.name LIKE :filter1))'],
            'search predefined joins' => [Card::class, 'foo', '((a.id LIKE :filter1 OR a.dating LIKE :filter1 OR a.code LIKE :filter1 OR a.name LIKE :filter1 OR a.locality LIKE :filter1 OR a.addition LIKE :filter1 OR a.expandedName LIKE :filter1 OR a.material LIKE :filter1 OR a.technique LIKE :filter1 OR institution1.name LIKE :filter1 OR artist1.name LIKE :filter1))'],
            'kitchen sink' => [Card::class, '  foo   bar   ', '((a.id LIKE :filter1 OR a.dating LIKE :filter1 OR a.code LIKE :filter1 OR a.name LIKE :filter1 OR a.locality LIKE :filter1 OR a.addition LIKE :filter1 OR a.expandedName LIKE :filter1 OR a.material LIKE :filter1 OR a.technique LIKE :filter1 OR institution1.name LIKE :filter1 OR artist1.name LIKE :filter1) AND (a.id LIKE :filter2 OR a.dating LIKE :filter2 OR a.code LIKE :filter2 OR a.name LIKE :filter2 OR a.locality LIKE :filter2 OR a.addition LIKE :filter2 OR a.expandedName LIKE :filter2 OR a.material LIKE :filter2 OR a.technique LIKE :filter2 OR institution1.name LIKE :filter2 OR artist1.name LIKE :filter2))'],
        ];
    }
}
