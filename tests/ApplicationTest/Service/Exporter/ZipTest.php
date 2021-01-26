<?php

declare(strict_types=1);

namespace ApplicationTest\Service\Exporter;

use Application\Service\Exporter\Zip;
use ApplicationTest\Traits\TestWithTransaction;
use ZipArchive;

class ZipTest extends AbstractWriter
{
    use TestWithTransaction;

    public function testWrite(): void
    {
        global $container;

        /** @var Zip $writer */
        $writer = $container->get(Zip::class);
        $tempFile = tempnam('data/tmp/', 'zip');

        $this->export($writer, $tempFile);

        // Assert that it is a valid ZIP file to prevent PhpSpreadsheet from hanging
        $zip = new ZipArchive();
        $res = $zip->open($tempFile, ZipArchive::CHECKCONS);
        self::assertTrue($res, 'exported file should be a valid ZIP file');

        self::assertNotFalse($zip->getFromName('111.html'), 'should contain an image');
        self::assertNotFalse($zip->getFromName('222.html'), 'should contain an image');
        self::assertNotFalse($zip->getFromName('222.jpg'), 'should contain an image');

        $actual = $zip->getFromName('222.html');
        self::assertStringContainsString('test with stuff', $actual);
        self::assertStringContainsString('expanded', $actual);

        $zip->close();
        unlink($tempFile);
    }
}
