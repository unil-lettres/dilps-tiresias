<?php

declare(strict_types=1);

namespace ApplicationTest\Service\Exporter;

use Application\DBAL\Types\ExportStatusType;
use Application\Model\Export;
use Application\Service\Exporter\Exporter;
use ApplicationTest\Traits\TestWithTransaction;
use PHPUnit\Framework\TestCase;

class ExporterTest extends TestCase
{
    use TestWithTransaction;

    public function testExport(): void
    {
        /** @var Export $export */
        $export = $this->getEntityManager()->getReference(Export::class, 14001);

        global $container;

        /** @var Exporter $exporter */
        $exporter = $container->get(Exporter::class);

        $export = $exporter->export($export);

        self::assertSame(ExportStatusType::DONE, $export->getStatus());
        self::assertSame(182276, $export->getFileSize());
        self::assertNotEmpty($export->getFilename());
        self::assertFileExists($export->getPath());
        self::assertNotNull($export->getStart());
        self::assertNotNull($export->getDuration());
        self::assertNotNull($export->getMemory());

        unlink($export->getPath());
    }
}
