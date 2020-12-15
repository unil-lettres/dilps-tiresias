<?php

declare(strict_types=1);

namespace Application\Action;

use Application\DBAL\Types\PrecisionType;
use Application\Repository\CountryRepository;
use Application\Repository\DocumentTypeRepository;
use Application\Repository\DomainRepository;
use Application\Repository\MaterialRepository;
use Application\Repository\PeriodRepository;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\NamedRange;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Serve XLSX template file
 */
class TemplateAction extends AbstractXlsx
{
    const HEADERS = [

        'Fichier image (avec ou sans extension)',
        'Titre',
        'Titre étendu',
        'Domaine',
        'Matériaux',
        'Période',
        'Date précise début',
        'Date précise fin',
        'Pays de découverte',
        'Site/Lieu de découverte',
        'Lieu de production',
        'Référence de l\'objet',
        'Type de document',
        'Auteur du document',
        'Année du document',
        'Latitude',
        'Longitude',
        'Précision',
    ];

    private int $row = 1;

    private int $col = 1;

    private string $site;

    private DomainRepository $domainRepository;

    private PeriodRepository $periodRepository;

    private CountryRepository $countryRepository;

    private MaterialRepository $materialRepository;

    private DocumentTypeRepository $documentTypeRepository;

    public function __construct(string $site, DomainRepository $domainRepository, PeriodRepository $periodRepository, CountryRepository $countryRepository, MaterialRepository $materialRepository, DocumentTypeRepository $documentTypeRepository)
    {
        $this->site = $site;
        $this->domainRepository = $domainRepository;
        $this->periodRepository = $periodRepository;
        $this->countryRepository = $countryRepository;
        $this->materialRepository = $materialRepository;
        $this->documentTypeRepository = $documentTypeRepository;
    }

    /**
     * Serve multiples cards as PowerPoint file
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $spreadsheet = $this->export();

        return $this->createResponse($spreadsheet);
    }

    /**
     * Export all cards into a presentation
     */
    private function export(): Spreadsheet
    {
        $spreadsheet = $this->createSpreadsheet($this->site);
        $sheet = $spreadsheet->getActiveSheet();

        $this->headers($sheet);

        $domainName = 'Domaines';
        $domains = $this->domainRepository->getFullNames();
        $this->createList($spreadsheet, array_keys($domains), $domainName);

        $materialName = 'Matériaux';
        $materials = $this->materialRepository->getFullNames();
        $this->createList($spreadsheet, array_keys($materials), $materialName);

        $periodName = 'Périodes';
        $periods = $this->periodRepository->getFullNames();
        $this->createList($spreadsheet, array_keys($periods), $periodName);

        $documentTypeName = 'Document';
        $documentTypes = $this->documentTypeRepository->getNames();
        $this->createList($spreadsheet, array_keys($documentTypes), $documentTypeName);

        $countryName = 'Pays';
        $countries = $this->countryRepository->getNames();
        $this->createList($spreadsheet, array_keys($countries), $countryName);

        $precisionName = 'Précisions';
        $precisions = [
            PrecisionType::LOCALITY,
            PrecisionType::SITE,
            PrecisionType::BUILDING,
        ];
        $this->createList($spreadsheet, $precisions, $precisionName);

        foreach (range(1, 100) as $row) {
            $this->col = 4;
            $this->writeSelect($sheet, $domainName);
            $this->writeSelect($sheet, $materialName);
            $this->writeSelect($sheet, $periodName);
            $this->col += 2;
            $this->writeSelect($sheet, $countryName);
            $this->col += 3;
            $this->writeSelect($sheet, $documentTypeName);
            $this->col = 18;
            $this->writeSelect($sheet, $precisionName);
            ++$this->row;
        }

        $style = $sheet->getStyleByColumnAndRow(1, 1, $this->col, $this->row);
        $style->getAlignment()->setWrapText(true);

        return $spreadsheet;
    }

    private function headers(Worksheet $sheet): void
    {
        foreach (self::HEADERS as $header) {
            $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $header);
        }

        $style = $sheet->getStyleByColumnAndRow(1, $this->row, $this->col, $this->row);
        $style->getFont()->setBold(true);

        // Adjust column width
        for ($col = 1; $col < $this->col; ++$col) {
            if ($col !== 3) {
                $sheet->getColumnDimensionByColumn($col)->setAutoSize(true);
            } else {
                $sheet->getColumnDimensionByColumn($col)->setWidth(50);
            }
        }

        $sheet->freezePaneByColumnAndRow(1, $this->row + 1);

        ++$this->row;
    }

    private function createList(Spreadsheet $spreadsheet, array $data, string $name): string
    {
        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle($name);
        $row = 1;
        foreach ($data as $d) {
            $sheet->setCellValueByColumnAndRow(1, $row++, $d);
        }

        $spreadsheet->addNamedRange(
            new NamedRange(
                $name,
                $sheet,
                'A1:A' . ($row - 1)
            )
        );

        return $name;
    }

    private function writeSelect(Worksheet $sheet, string $name): void
    {
        $validation = $sheet
            ->getCellByColumnAndRow($this->col++, $this->row)
            ->getDataValidation();

        $validation->setType(DataValidation::TYPE_LIST)
            ->setErrorStyle(DataValidation::STYLE_INFORMATION)
            ->setAllowBlank(true)
            ->setShowInputMessage(true)
            ->setShowErrorMessage(true)
            ->setShowDropDown(true)
            ->setErrorTitle('Erreur de saisie')
            ->setError('Cette valeur est introuvable dans la liste.')
            ->setPromptTitle('Choisissez dans la liste')
            ->setPrompt('Choisissez un élément de la liste.')
            ->setFormula1('=' . $name);
    }
}
