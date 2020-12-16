<?php

declare(strict_types=1);

namespace ApplicationTest\Handler;

use ApplicationTest\Traits\TestWithTransaction;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use ZipArchive;

class AbstractXlsxHandler extends TestCase
{
    use TestWithTransaction;

    protected function getSpreadsheet(RequestHandlerInterface $handler, ServerRequestInterface $request): Spreadsheet
    {
        // Generate a response containing a spreadsheet
        $response = $handler->handle($request);

        self::assertEquals(200, $response->getStatusCode());
        self::assertStringContainsString('inline; filename="dilps', $response->getHeaderLine('content-disposition'));
        self::assertEquals('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', $response->getHeaderLine('content-type'));

        // Write in a temp file
        $body = $response->getBody()->getContents();
        $filename = tempnam(sys_get_temp_dir(), 'test');
        file_put_contents($filename, $body);

        $size = filesize($filename);
        self::assertEquals($size, $response->getHeaderLine('content-length'));

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
