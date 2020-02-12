<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Action\TemplateAction;
use Application\DBAL\Types\PrecisionType;
use Application\Model\AbstractModel;
use Application\Model\Card;
use Application\Model\Collection;
use Application\Model\Country;
use Application\Model\DocumentType;
use Application\Model\Domain;
use Application\Model\Material;
use Application\Model\Period;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Psr\Http\Message\UploadedFileInterface;
use Throwable;

class Importer
{
    private $domains;

    private $documentTypes;

    private $countries;

    private $materials;

    private $periods;

    /**
     * @var string
     */
    private $site;

    /**
     * @var null|Collection
     */
    private $collection;

    public function __construct()
    {
        $this->domains = _em()->getRepository(Domain::class)->getFullNames();
        $this->periods = _em()->getRepository(Period::class)->getFullNames();
        $this->materials = _em()->getRepository(Material::class)->getFullNames();
        $this->countries = _em()->getRepository(Country::class)->getNames();
        $this->documentTypes = _em()->getRepository(DocumentType::class)->getNames();
    }

    public function import(UploadedFileInterface $file, array $files, string $site, ?Collection $collection): array
    {
        $this->site = $site;
        $this->collection = $collection;
        $tempFile = tempnam('data/tmp/', 'import');
        $file->moveTo($tempFile);
        $spreadsheet = IOFactory::load($tempFile);
        $sheet = $spreadsheet->getSheet(0);

        $this->assertHeaders($sheet);
        $cards = $this->importSheet($sheet, $files);
        unlink($tempFile);

        return $cards;
    }

    private function assertHeaders(Worksheet $sheet): void
    {
        $col = 1;
        $row = 1;
        foreach (TemplateAction::HEADERS as $header) {
            $actual = $sheet->getCellByColumnAndRow($col, $row)->getValue();
            if ($actual !== $header) {
                $this->throwException($col, $row, 'S\'attend à "' . $header . '", mais a vu "' . $actual . '"');
            }
            ++$col;
        }
    }

    private function importSheet(Worksheet $sheet, array $images): array
    {
        $imagesToImport = $this->indexByName($images);

        $col = 1;
        $row = 2;

        $cards = [];
        while ($imageName = (string) $sheet->getCellByColumnAndRow($col, $row)->getValue()) {
            $imageNameWithoutExtension = pathinfo($imageName, PATHINFO_FILENAME);
            if (!array_key_exists($imageNameWithoutExtension, $imagesToImport)) {
                $this->throwException($col, $row, 'Image présente dans le fichier Excel, mais pas retrouvée dans les images uploadées: ' . $imageName);
            }

            $image = $imagesToImport[$imageNameWithoutExtension];
            $cards[] = $this->importOne($sheet, $row, $image);

            unset($imagesToImport[$imageNameWithoutExtension]);

            ++$row;
        }

        if (count($imagesToImport) > 1) {
            $message = count($imagesToImport) . ' images ont été uploadé pour lesquelles aucune information ont été trouvée dans le fichier Excel: ' . implode(', ', array_keys($imagesToImport));
            $this->throwException($col, $row, $message);
        }

        return $cards;
    }

    private function throwException(int $column, int $row, string $message, ?Throwable $previousException = null): void
    {
        $cell = Coordinate::stringFromColumnIndex($column) . $row;
        $message = 'Erreur dans la cellule ' . $cell . ': ' . $message;

        throw new \Exception($message, 0, $previousException);
    }

    /**
     * @param array $images
     *
     * @return array
     */
    private function indexByName(array $images): array
    {
        $imagesToImport = [];
        foreach ($images as $image) {
            $filename = pathinfo($image->getClientFilename(), PATHINFO_FILENAME);
            $imagesToImport[$filename] = $image;
        }

        return $imagesToImport;
    }

    private function importOne(Worksheet $sheet, int $row, UploadedFileInterface $image): Card
    {
        $card = new Card();
        $card->setSite($this->site);
        if ($this->collection) {
            $this->collection->addCard($card);
        }

        _em()->persist($card);
        $col = 2;

        $card->setName($this->readString($sheet, $col++, $row));
        $card->setExpandedName($this->readString($sheet, $col++, $row));
        $card->setDomain($this->readDomain($sheet, $col++, $row));

        $material = $this->readMaterial($sheet, $col++, $row);
        if ($material) {
            $card->addMaterial($material);
        }

        $period = $this->readPeriod($sheet, $col++, $row);
        if ($period) {
            $card->addPeriod($period);
        }

        $card->setFrom($this->readInt($sheet, $col++, $row));
        $card->setTo($this->readInt($sheet, $col++, $row));
        $card->setCountry($this->readCountry($sheet, $col++, $row));
        $card->setLocality($this->readString($sheet, $col++, $row));
        $card->setProductionPlace($this->readString($sheet, $col++, $row));
        $card->setObjectReference($this->readString($sheet, $col++, $row));
        $card->setDocumentType($this->readDocumentType($sheet, $col++, $row));
        $card->setTechniqueAuthor($this->readString($sheet, $col++, $row));
        $card->setTechniqueDate($this->readString($sheet, $col++, $row));
        $card->setLatitude($this->readFloat($sheet, $col++, $row));
        $card->setLongitude($this->readFloat($sheet, $col++, $row));
        $card->setPrecision($this->readPrecision($sheet, $col++, $row));

        try {
            $card->setFile($image);
        } catch (Throwable $e) {
            $this->throwException($col, 1, 'Erreur avec l\'image', $e);
        }

        return $card;
    }

    private function readString(Worksheet $sheet, int $col, int $row): string
    {
        return trim((string) $sheet->getCellByColumnAndRow($col, $row)->getValue());
    }

    private function readDomain(Worksheet $sheet, int $col, int $row): ?Domain
    {
        return $this->read($sheet, $col, $row, Domain::class, $this->domains, 'Domaine');
    }

    private function readMaterial(Worksheet $sheet, int $col, int $row): ?Material
    {
        return $this->read($sheet, $col, $row, Material::class, $this->materials, 'Materiel');
    }

    private function readPeriod(Worksheet $sheet, int $col, int $row): ?Period
    {
        return $this->read($sheet, $col, $row, Period::class, $this->periods, 'Période');
    }

    private function readCountry(Worksheet $sheet, int $col, int $row): ?Country
    {
        return $this->read($sheet, $col, $row, Country::class, $this->countries, 'Pays');
    }

    private function readDocumentType(Worksheet $sheet, int $col, int $row): ?DocumentType
    {
        return $this->read($sheet, $col, $row, DocumentType::class, $this->documentTypes, 'Type de document');
    }

    private function readPrecision(Worksheet $sheet, int $col, int $row): ?string
    {
        $value = $sheet->getCellByColumnAndRow($col, $row)->getValue();
        if (!$value) {
            return null;
        }

        $values = [
            PrecisionType::BUILDING,
            PrecisionType::LOCALITY,
            PrecisionType::SITE,
        ];

        if (in_array($value, $values, true)) {
            return $value;
        }

        $this->throwException($col, $row, 'Précision introuvable: ' . $value);
    }

    private function read(Worksheet $sheet, int $col, int $row, string $class, array $values, string $name): ?AbstractModel
    {
        $value = $sheet->getCellByColumnAndRow($col, $row)->getValue();
        if (!$value) {
            return null;
        }

        if (array_key_exists($value, $values)) {
            return _em()->getRepository($class)->find($values[$value]);
        }

        $this->throwException($col, $row, $name . ' introuvable: ' . $value);
    }

    private function readInt(Worksheet $sheet, int $col, int $row): ?int
    {
        $value = $sheet->getCellByColumnAndRow($col, $row)->getValue();
        if (!$value) {
            return null;
        }

        if (is_numeric($value)) {
            return (int) $value;
        }

        $this->throwException($col, $row, 'N\' pas un nombre entier: ' . $value);
    }

    private function readFloat(Worksheet $sheet, int $col, int $row): ?float
    {
        $value = $sheet->getCellByColumnAndRow($col, $row)->getValue();
        if (!$value) {
            return null;
        }

        if (is_numeric('123')) {
            return (float) $value;
        }

        $this->throwException($col, $row, 'N\' pas un nombre à virgule: ' . $value);
    }
}
