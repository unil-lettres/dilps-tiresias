<?php

declare(strict_types=1);

namespace ApplicationTest\Service\Exporter;

use Application\Service\Exporter\Xlsx;
use ApplicationTest\Traits\TestWithSpreadsheet;
use ApplicationTest\Traits\TestWithTransaction;

class XlsxTest extends AbstractWriter
{
    use TestWithTransaction;
    use TestWithSpreadsheet;

    public function testWrite(): void
    {
        global $container;

        /** @var Xlsx $writer */
        $writer = $container->get(Xlsx::class);
        $tempFile = tempnam('data/tmp/', 'xlsx');

        $this->export($writer, $tempFile);

        $spreadsheet = $this->readSpreadsheet($tempFile);

        $sheet = $spreadsheet->getActiveSheet();
        self::assertSame('Id', $sheet->getCell('A1')->getValue());
        self::assertSame('test with nothing', $sheet->getCell('B2')->getValue());
        self::assertSame('test with stuff', $sheet->getCell('B3')->getValue());
        self::assertSame('• period', $sheet->getCell('E3')->getValue());
        self::assertSame('country', $sheet->getCell('H3')->getValue());
        self::assertSame('document type', $sheet->getCell('L3')->getValue());
        self::assertSame('building', $sheet->getCell('Q3')->getValue());
    }
}
