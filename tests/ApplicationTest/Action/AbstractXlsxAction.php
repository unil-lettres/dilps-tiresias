<?php

declare(strict_types=1);

namespace ApplicationTest\Action;

use ApplicationTest\Traits\TestWithTransaction;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use ZipArchive;

class AbstractXlsxAction extends TestCase
{
    use TestWithTransaction;

    protected function getSpreadsheet(MiddlewareInterface $action, ServerRequestInterface $request): Spreadsheet
    {
        // Generate a response containing a spreadsheet
        $handler = $this->prophesize(RequestHandlerInterface::class);
        $response = $action->process($request, $handler->reveal());

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertStringContainsString('inline; filename="DILPS', $response->getHeaderLine('content-disposition'));
        $this->assertEquals('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', $response->getHeaderLine('content-type'));

        // Write in a temp file
        $body = $response->getBody()->getContents();
        $filename = tempnam(sys_get_temp_dir(), 'test');
        file_put_contents($filename, $body);

        $size = mb_strlen($body);
        $this->assertEquals($size, $response->getHeaderLine('content-length'));

        // Assert that it is a valid ZIP file to prevent PhpSpreadsheet from hanging
        $zip = new ZipArchive();
        $res = $zip->open($filename, ZipArchive::CHECKCONS);
        self::assertTrue($res, 'exported Excel should be a valid ZIP file');
        $zip->close();

        // Re-read it
        $reader = new Xlsx();
        $spreadsheet = $reader->load($filename);

//        unlink($filename);
        return $spreadsheet;
    }
}
