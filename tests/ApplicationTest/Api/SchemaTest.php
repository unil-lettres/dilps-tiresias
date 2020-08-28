<?php

declare(strict_types=1);

namespace ApplicationTest\Api;

use Application\Api\Schema;
use PHPUnit\Framework\TestCase;

class SchemaTest extends TestCase
{
    public function testSchemaIsValid(): void
    {
        $schema = new Schema();
        $schema->assertValid();

        self::assertTrue(true, 'schema passes validation');
    }
}
