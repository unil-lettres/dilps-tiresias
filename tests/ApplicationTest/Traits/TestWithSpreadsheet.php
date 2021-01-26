<?php

declare(strict_types=1);

namespace ApplicationTest\Traits;

use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use ZipArchive;

trait TestWithSpreadsheet
{
    abstract public static function assertTrue($condition, string $message = ''): void;

    private function readSpreadsheet(string $filename): Spreadsheet
    {
        // Assert that it is a valid ZIP file to prevent PhpSpreadsheet from hanging
        $zip = new ZipArchive();
        $res = $zip->open($filename, ZipArchive::CHECKCONS);
        self::assertTrue($res, 'exported Excel should be a valid ZIP file');
        $zip->close();

        // Re-read it
        $reader = new Xlsx();
        $spreadsheet = $reader->load($filename);
        unlink($filename);

        return $spreadsheet;
    }
}
