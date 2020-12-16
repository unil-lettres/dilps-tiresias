<?php

declare(strict_types=1);

namespace ApplicationTest\Handler;

use Application\Handler\TemplateHandler;
use ApplicationTest\Traits\TestWithTransaction;
use Laminas\Diactoros\ServerRequest;

class TemplateHandlerTest extends AbstractXlsxHandler
{
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
}
