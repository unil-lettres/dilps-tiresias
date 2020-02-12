<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\Action\TemplateAction;
use Application\Model\Card;
use Application\Model\Collection;
use Application\Service\Importer;
use Laminas\Diactoros\UploadedFile;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PHPUnit\Framework\TestCase;

class ImporterTest extends TestCase
{
    private function createExcel(array $data): UploadedFile
    {
        $s = new Spreadsheet();
        $s->getActiveSheet()->fromArray($data);

        $writer = new Xlsx($s);
        $filename = tempnam(sys_get_temp_dir(), 'test');

        $writer->save($filename);

        $excel = new UploadedFile($filename, 999, UPLOAD_ERR_OK, 'foo.xlsx', 'text/plain');

        return $excel;
    }

    private function createImages(array $paths): array
    {
        return array_map(function (string $path) {
            $basename = pathinfo($path, PATHINFO_BASENAME);

            return new UploadedFile($path, 999, UPLOAD_ERR_OK, $basename, 'text/plain');
        }, $paths);
    }

    public function testImport(): void
    {
        $excel = $this->createExcel([
            TemplateAction::HEADERS,
            ['5da49355cbcff.jpeg', 'Super name', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['dw4jV3zYSPsqE2CB8BcP8ABD0', 'My Name', 'Long description', 'Test domain 9001', 'Test root material 8000 > Test child material 8001', 'Test root period 7000', '123', '456', 'Anguilla', 'The Valley', 'Paris', 'REF972', 'Test document type 11001', 'John Rambo', '1997', '1.1231', '123.132', 'building'],
        ]);

        $images = $this->createImages([
            'data/images/5da49355cbcff.jpeg',
            'data/images/dw4jV3zYSPsqE2CB8BcP8ABD0.jpg',
        ]);

        $collection = new Collection();

        $importer = new Importer();
        $cards = $importer->import($excel, $images, 'dilps', $collection);

        self::assertCount(2, $collection->getCards());

        /** @var Card $c */
        $c = $cards[1];
        self::assertSame('My Name', $c->getName());
        self::assertSame('Long description', $c->getExpandedName());
        self::assertSame('Test child material 8001', $c->getMaterials()->first()->getName());
        self::assertSame('Test root period 7000', $c->getPeriods()->first()->getName());
        self::assertSame(123, $c->getFrom());
        self::assertSame(456, $c->getTo());
        self::assertSame('Anguilla', $c->getCountry()->getName());
        self::assertSame('The Valley', $c->getLocality());
        self::assertSame('Paris', $c->getProductionPlace());
        self::assertSame('REF972', $c->getObjectReference());
        self::assertSame('Test domain 9001', $c->getDomain()->getName());
        self::assertSame('John Rambo', $c->getTechniqueAuthor());
        self::assertSame('1997', $c->getTechniqueDate());
        self::assertSame(1.1231, $c->getLatitude());
        self::assertSame(123.132, $c->getLongitude());
        self::assertSame('building', $c->getPrecision());
    }

    public function testImportThrowsWithWrongHeaders(): void
    {
        $excel = $this->createExcel([
            ['invalid header'],
        ]);

        $importer = new Importer();
        $this->expectExceptionMessage('Erreur dans la cellule A1: S\'attend à "Fichier image (avec ou sans extension)", mais a vu "invalid header"');
        $importer->import($excel, [], 'dilps', null);
    }

    public function testImportThrowsWithTooManyFiles(): void
    {
        $excel = $this->createExcel([
            TemplateAction::HEADERS,
        ]);

        $images = $this->createImages([
            'data/images/5da49355cbcff.jpeg',
            'data/images/dw4jV3zYSPsqE2CB8BcP8ABD0.jpg',
        ]);

        $importer = new Importer();
        $this->expectExceptionMessage('Erreur dans la cellule A2: 2 images ont été uploadé pour lesquelles aucune information ont été trouvée dans le fichier Excel: 5da49355cbcff, dw4jV3zYSPsqE2CB8BcP8ABD0');
        $importer->import($excel, $images, 'dilps', null);
    }

    public function testImportThrowsWithTooManyData(): void
    {
        $excel = $this->createExcel([
            TemplateAction::HEADERS,
            ['5da49355cbcff.jpeg', 'Super mario', 'tre etneruentuendu', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['dw4jV3zYSPsqE2CB8BcP8ABD0', 'My Name', 'Long description', 'Test domain 9001', 'Test root material 8000 > Test child material 8001', 'Test root period 7000', '123', '456', 'Anguilla', 'The Valley', 'Paris', 'REF972', 'Test document type 11001', 'John Rambo', '1997', '1.1231', '1231.132', 'building'],

        ]);

        $importer = new Importer();
        $this->expectExceptionMessage('Erreur dans la cellule A2: Image présente dans le fichier Excel, mais pas retrouvée dans les images uploadées: 5da49355cbcff.jpeg');
        $importer->import($excel, [], 'dilps', null);
    }

    public function testImportThrowsWithInvalidData(): void
    {
        $excel = $this->createExcel([
            TemplateAction::HEADERS,
            ['dw4jV3zYSPsqE2CB8BcP8ABD0', 'My Name', 'Long description', 'non-existing-domain', 'Test root material 8000 > Test child material 8001', 'Test root period 7000', '123', '456', 'Anguilla', 'The Valley', 'Paris', 'REF972', 'Test document type 11001', 'John Rambo', '1997', '1.1231', '1231.132', 'building'],

        ]);

        $images = $this->createImages([
            'data/images/dw4jV3zYSPsqE2CB8BcP8ABD0.jpg',
        ]);

        $importer = new Importer();
        $this->expectExceptionMessage('Erreur dans la cellule D2: Domaine introuvable: non-existing-domain');
        $importer->import($excel, $images, 'dilps', null);
    }
}
