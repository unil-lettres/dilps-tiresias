<?php

declare(strict_types=1);

namespace ApplicationTest\Service\Exporter;

use Application\DBAL\Types\PrecisionType;
use Application\DBAL\Types\SiteType;
use Application\Model\Card;
use Application\Model\Country;
use Application\Model\DocumentType;
use Application\Model\Export;
use Application\Model\Material;
use Application\Model\Period;
use Application\Service\Exporter\Pptx;
use Application\Service\Exporter\Writer;
use PHPUnit\Framework\TestCase;

class AbstractWriter extends TestCase
{
    protected function export(Writer $writer, string $tempFile): void
    {
        $export = $this->createMockExport($tempFile);

        $writer->initialize($export, 'Test Pptx');
        foreach ($this->createMockCards() as $card) {
            $writer->write($card);
        }
        $writer->finalize();
    }

    protected function createMockExport(string $path): Export
    {
        $export = $this->getMockBuilder(Export::class)
            ->onlyMethods(['getId', 'getSite', 'getPath'])
            ->getMock();

        $export->expects(self::any())
            ->method('getId')
            ->willReturn(333);

        $export->expects(self::any())
            ->method('getSite')
            ->willReturn(SiteType::DILPS);

        $export->expects(self::once())
            ->method('getPath')
            ->willReturn($path);

        return $export;
    }

    protected function createMockCards(): array
    {
        $card1 = $this->getMockBuilder(Card::class)
            ->onlyMethods(['getId'])
            ->getMock();

        $card1->expects(self::any())
            ->method('getId')
            ->willReturn(111);

        $card1->setName('test with nothing');

        $documentType = new DocumentType();
        $documentType->setName('document type');
        $period = new Period();
        $period->setName('period');
        $material = new Material();
        $material->setName('material');
        $country = new Country();
        $country->setName('country');

        $card2 = $this->getMockBuilder(Card::class)
            ->onlyMethods(['getId'])
            ->getMock();

        $card2->expects(self::any())
            ->method('getId')
            ->willReturn(222);

        $card2->setName('test with stuff');
        $card2->setExpandedName('expanded');
        $card2->setDocumentType($documentType);
        $card2->addPeriod($period);
        $card2->addMaterial($material);
        $card2->setCountry($country);
        $card2->setPrecision(PrecisionType::BUILDING);
        $card2->setFilename('dw4jV3zYSPsqE2CB8BcP8ABD0.jpg');

        return [$card1, $card2];
    }
}
