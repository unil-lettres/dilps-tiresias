<?php

declare(strict_types=1);

namespace ApplicationTest;

use ApplicationTest\Traits\TestWithTransaction;
use PHPUnit\Framework\TestCase;

class TriggersTest extends TestCase
{
    use TestWithTransaction;

    /**
     * @dataProvider providerGetUsageCountManyToMany
     */
    public function testGetUsageCountManyToMany(string $table, int $id1, int $id2): void
    {
        $initial1 = $this->getUsageCount($table, $id1);
        $initial2 = $this->getUsageCount($table, $id2);

        $this->assertUsageCount($table, $id1, $initial1);
        $this->assertUsageCount($table, $id2, $initial2);

        $this->create($table, $id1);
        $this->assertUsageCount($table, $id1, $initial1 + 1);
        $this->assertUsageCount($table, $id2, $initial2);

        $this->create($table, $id2);
        $this->assertUsageCount($table, $id1, $initial1 + 1);
        $this->assertUsageCount($table, $id2, $initial2 + 1);

        $this->delete($table, $id1);
        $this->assertUsageCount($table, $id1, $initial1);
        $this->assertUsageCount($table, $id2, $initial2 + 1);

        $this->delete($table, $id2);
        $this->assertUsageCount($table, $id1, $initial1);
        $this->assertUsageCount($table, $id2, $initial2);
    }

    public function providerGetUsageCountManyToMany(): iterable
    {
        yield ['antique_name', 12000, 12001];
        yield ['artist', 3000, 3001];
        yield ['domain', 9000, 9001];
        yield ['material', 8000, 8001];
        yield ['period', 7000, 7001];
        yield ['tag', 4000, 4001];
    }

    private function assertUsageCount(string $table, int $id, int $expected): void
    {
        self::assertSame($expected, $this->getUsageCount($table, $id));
    }

    private function create(string $table, int $id): void
    {
        $field = $table . '_id';
        $relation = "card_$table";

        $affected = $this->getEntityManager()->getConnection()->executeStatement("INSERT INTO $relation (card_id, $field) VALUES (6005, $id)");

        self::assertSame(1, $affected);
    }

    private function delete(string $table, int $id): void
    {
        $field = $table . '_id';
        $relation = "card_$table";

        $affected = $this->getEntityManager()->getConnection()->executeStatement("DELETE FROM $relation WHERE card_id = 6005 AND $field = $id");

        self::assertSame(1, $affected);
    }

    private function getUsageCount(string $table, int $id): mixed
    {
        return $this->getEntityManager()->getConnection()->fetchOne("SELECT usage_count FROM `$table` WHERE id = $id");
    }

    /**
     * @dataProvider providerGetUsageCountManyToOne
     */
    public function testGetUsageCountManyToOne(string $table, int $id1, int $id2): void
    {
        $initial1 = $this->getUsageCount($table, $id1);
        $initial2 = $this->getUsageCount($table, $id2);

        $this->assertUsageCount($table, $id1, $initial1);
        $this->assertUsageCount($table, $id2, $initial2);

        $this->update($table, 6005, $id1);
        $this->assertUsageCount($table, $id1, $initial1 + 1);
        $this->assertUsageCount($table, $id2, $initial2);

        $this->update($table, 6005, $id2);
        $this->assertUsageCount($table, $id1, $initial1);
        $this->assertUsageCount($table, $id2, $initial2 + 1);

        $this->update($table, 6012, $id1);
        $this->assertUsageCount($table, $id1, $initial1 + 1);
        $this->assertUsageCount($table, $id2, $initial2 + 1);

        $this->update($table, 6012, $id2);
        $this->assertUsageCount($table, $id1, $initial1);
        $this->assertUsageCount($table, $id2, $initial2 + 2);

        $this->update($table, 6005, null);
        $this->assertUsageCount($table, $id1, $initial1);
        $this->assertUsageCount($table, $id2, $initial2 + 1);

        $this->update($table, 6012, null);
        $this->assertUsageCount($table, $id1, $initial1);
        $this->assertUsageCount($table, $id2, $initial2);
    }

    public function providerGetUsageCountManyToOne(): iterable
    {
        yield ['institution', 5000, 5001, true];
        yield ['document_type', 11000, 11001, true];
    }

    private function update(string $table, int $cardId, ?int $id): void
    {
        $field = $table . '_id';

        $id ??= 'NULL';

        $affected = $this->getEntityManager()->getConnection()->executeStatement("UPDATE card SET $field = $id WHERE id = $cardId");

        self::assertSame(1, $affected);
    }
}
