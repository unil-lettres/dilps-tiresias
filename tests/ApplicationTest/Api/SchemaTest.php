<?php

declare(strict_types=1);

namespace ApplicationTest\Api;

use Application\Api\Schema;
use GraphQL\GraphQL;
use GraphQL\Type\Introspection;
use PHPUnit\Framework\TestCase;

class SchemaTest extends TestCase
{
    private Schema $schema;

    protected function setUp(): void
    {
        parent::setUp();
        $this->schema = new Schema();
    }

    public function testSchemaIsValid(): void
    {
        $this->schema->assertValid();

        self::assertTrue(true, 'schema passes validation');
    }

    public function testSchemaCanBeIntrospected(): void
    {
        $result = GraphQL::executeQuery(
            $this->schema,
            Introspection::getIntrospectionQuery()
        );

        self::assertSame([], $result->errors, 'should not have any errors during introspection');
    }
}
