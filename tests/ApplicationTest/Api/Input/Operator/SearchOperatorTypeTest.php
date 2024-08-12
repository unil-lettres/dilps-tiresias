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

    public function providerSearch(): iterable
    {
        yield 'simple' => [DocumentType::class, 'john', '((a.name LIKE :filter1))'];
        yield 'search predefined fields' => [User::class, 'john', '((a.login LIKE :filter1 OR a.email LIKE :filter1 OR a.name LIKE :filter1))'];
        yield 'search predefined joins' => [Card::class, 'foo', '( (MATCH (a.dating,a.cachedArtistNames,a.addition,a.expandedName,a.material,a.dilpsDomain,a.techniqueAuthor,a.objectReference,a.corpus,a.street,a.locality,a.code,a.name) AGAINST (:filter1 IN BOOLEAN MODE) > 0)  OR  (MATCH (a.locality) AGAINST (:filter2 IN BOOLEAN MODE) > 0)  OR  (MATCH (a.expandedName,a.name) AGAINST (:filter3 IN BOOLEAN MODE) > 0)  OR  (MATCH (institution1.name) AGAINST (:filter4 IN BOOLEAN MODE) > 0)  OR  (MATCH (country1.name) AGAINST (:filter5 IN BOOLEAN MODE) > 0)  OR  (MATCH (domain1.name) AGAINST (:filter6 IN BOOLEAN MODE) > 0) )'];
        yield 'search id' => [Card::class, '1', '((a.dating LIKE :filter2 OR a.cachedArtistNames LIKE :filter2 OR a.addition LIKE :filter2 OR a.expandedName LIKE :filter2 OR a.material LIKE :filter2 OR a.dilpsDomain LIKE :filter2 OR a.techniqueAuthor LIKE :filter2 OR a.objectReference LIKE :filter2 OR a.corpus LIKE :filter2 OR a.street LIKE :filter2 OR a.locality LIKE :filter2 OR a.code LIKE :filter2 OR a.name LIKE :filter2 OR institution1.name LIKE :filter2 OR country1.name LIKE :filter2 OR domain1.name LIKE :filter2)) OR ( a.id IN (:filter1) )'];
    }
}
