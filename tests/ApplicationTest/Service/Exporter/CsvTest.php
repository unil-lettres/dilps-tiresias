<?php

declare(strict_types=1);

namespace ApplicationTest\Service\Exporter;

use Application\Service\Exporter\Csv;
use ApplicationTest\Traits\TestWithTransaction;

class CsvTest extends AbstractWriter
{
    use TestWithTransaction;

    public function testWrite(): void
    {
        global $container;

        /** @var Csv $writer */
        $writer = $container->get(Csv::class);
        $tempFile = tempnam('data/tmp/', 'csv');

        $this->export($writer, $tempFile);

        $file = fopen($tempFile, 'rb');
        $line1 = fgetcsv($file);
        $line2 = fgetcsv($file);
        $line3 = fgetcsv($file);
        fclose($file);
        unlink($tempFile);

        self::assertSame('Id', $line1[0]);
        self::assertSame('test with nothing', $line2[1]);
        self::assertSame('test with stuff', $line3[1]);
        self::assertSame('• period', $line3[4]);
        self::assertSame('country', $line3[7]);
        self::assertSame('document type', $line3[11]);
        self::assertSame('building', $line3[16]);
    }
}
