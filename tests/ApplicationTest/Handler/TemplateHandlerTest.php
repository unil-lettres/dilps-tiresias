<?php

declare(strict_types=1);

namespace ApplicationTest\Handler;

use Application\Handler\TemplateHandler;
use ApplicationTest\Traits\TestWithSpreadsheet;
use ApplicationTest\Traits\TestWithTransaction;
use Laminas\Diactoros\ServerRequest;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class TemplateHandlerTest extends TestCase
{
    use TestWithSpreadsheet;
    use TestWithTransaction;

    public function testProcess(): void
    {
        global $container;

        /** @var TemplateHandler $handler */
        $handler = $container->get(TemplateHandler::class);
        $request = new ServerRequest();

        $spreadsheet = $this->getSpreadsheet($handler, $request);

        self::assertSame('Fichier image (avec ou sans extension)', $spreadsheet->getActiveSheet()->getCell('A1')->getValue());
    }

    private function getSpreadsheet(RequestHandlerInterface $handler, ServerRequestInterface $request): Spreadsheet
    {
        // Generate a response containing a spreadsheet
        $response = $handler->handle($request);

        self::assertEquals(200, $response->getStatusCode());
        self::assertStringContainsString('inline; filename="DILPS', $response->getHeaderLine('content-disposition'));
        self::assertEquals('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', $response->getHeaderLine('content-type'));

        // Write in a temp file
        $body = $response->getBody()->getContents();
        $filename = tempnam(sys_get_temp_dir(), 'test');
        file_put_contents($filename, $body);

        $size = filesize($filename);
        self::assertEquals($size, $response->getHeaderLine('content-length'));

        return $this->readSpreadsheet($filename);
    }
}
