<?php

declare(strict_types=1);

namespace ApplicationTest\ORM;

use Doctrine\ORM\Tools\SchemaValidator;

class MappingTest extends \Ecodev\Felix\Testing\ORM\MappingTest
{
    public function testMappingIsSync(): void
    {
        $em = _em();
        $validator = new SchemaValidator($em);

        self::assertTrue(
            $validator->schemaInSyncWithMetadata(),
            'diff is: ' . json_encode($validator->getUpdateSchemaList()),
        );
    }
}
