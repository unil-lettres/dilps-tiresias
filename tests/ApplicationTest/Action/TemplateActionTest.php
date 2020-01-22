<?php

declare(strict_types=1);

namespace ApplicationTest\Action;

use Application\Action\TemplateAction;
use ApplicationTest\Traits\TestWithTransaction;
use Laminas\Diactoros\ServerRequest;

class TemplateActionTest extends AbstractXlsxAction
{
    use TestWithTransaction;

    public function testProcess(): void
    {
        global $container;

        /** @var TemplateAction $action */
        $action = $container->get(TemplateAction::class);
        $request = new ServerRequest();

        $spreadsheet = $this->getSpreadsheet($action, $request);

        self::assertSame('Fichier image (avec ou sans extension)', $spreadsheet->getActiveSheet()->getCell('A1')->getValue());
    }
}
