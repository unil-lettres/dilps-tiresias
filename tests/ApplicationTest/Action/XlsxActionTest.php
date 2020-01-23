<?php

declare(strict_types=1);

namespace ApplicationTest\Action;

use Application\Action\XlsxAction;
use Application\DBAL\Types\PrecisionType;
use Application\Model\Card;
use Application\Model\Country;
use Application\Model\DocumentType;
use Application\Model\Material;
use Application\Model\Period;
use ApplicationTest\Traits\TestWithTransaction;
use Laminas\Diactoros\ServerRequest;

class XlsxActionTest extends AbstractXlsxAction
{
    use TestWithTransaction;

    public function testProcess(): void
    {
        global $container;

        /** @var XlsxAction $action */
        $action = $container->get(XlsxAction::class);
        $request = new ServerRequest();

        $card1 = new Card();
        $card1->setName('test with nothing');

        $documentType = new DocumentType();
        $documentType->setName('document type');
        $period = new Period();
        $period->setName('period');
        $material = new Material();
        $material->setName('period');
        $country = new Country();
        $country->setName('country');

        $card2 = new Card();
        $card2->setName('test with stuff');
        $card2->setExpandedName('expanded');
        $card2->setDocumentType($documentType);
        $card2->addPeriod($period);
        $card2->addMaterial($material);
        $card2->setCountry($country);
        $card2->setPrecision(PrecisionType::BUILDING);

        $request = $request->withAttribute('cards', [$card1, $card2]);
        $spreadsheet = $this->getSpreadsheet($action, $request);

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
