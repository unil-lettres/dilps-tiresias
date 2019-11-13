<?php

declare(strict_types=1);

namespace Application\Action;

use Application\DBAL\Types\PrecisionType;
use Application\Model\Card;
use Application\Model\User;
use Application\Repository\CountryRepository;
use Application\Repository\DocumentTypeRepository;
use Application\Repository\DomainRepository;
use Application\Repository\MaterialRepository;
use Application\Repository\PeriodRepository;
use Application\Stream\TemporaryFile;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\NamedRange;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response;

/**
 * Serve XLSX template file
 */
class TemplateAction extends AbstractAction
{
    /**
     * @var int
     */
    private $row = 1;

    /**
     * @var int
     */
    private $col = 1;

    /**
     * @var DomainRepository
     */
    private $domainRepository;

    /**
     * @var PeriodRepository
     */
    private $periodRepository;

    /**
     * @var CountryRepository
     */
    private $countryRepository;

    /**
     * @var MaterialRepository
     */
    private $materialRepository;

    /**
     * @var DocumentTypeRepository
     */
    private $documentTypeRepository;

    public function __construct(DomainRepository $domainRepository, PeriodRepository $periodRepository, CountryRepository $countryRepository, MaterialRepository $materialRepository, DocumentTypeRepository $documentTypeRepository)
    {
        $this->domainRepository = $domainRepository;
        $this->periodRepository = $periodRepository;
        $this->countryRepository = $countryRepository;
        $this->materialRepository = $materialRepository;
        $this->documentTypeRepository = $documentTypeRepository;
    }

    /**
     * Serve multiples cards as PowerPoint file
     *
     * @param ServerRequestInterface $request
     * @param RequestHandlerInterface $handler
     *
     * @return ResponseInterface
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $title = 'DILPS ' . date('c', time());
        $spreadsheet = $this->export($title);

        // Write to disk
        $tempFile = tempnam('data/tmp/', 'xlsx');

        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);

        $headers = [
            'content-type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'content-length' => filesize($tempFile),
            'content-disposition' => 'inline; filename="' . $title . '.xlsx"',
        ];
        $stream = new TemporaryFile($tempFile);
        $response = new Response($stream, 200, $headers);

        return $response;
    }

    /**
     * Export all cards into a presentation
     *
     * @param Card[] $cards
     * @param string $title
     *
     * @return Spreadsheet
     */
    private function export(string $title): Spreadsheet
    {
        $spreadsheet = new Spreadsheet();

        // Set a few meta data
        $properties = $spreadsheet->getProperties();
        $properties->setCreator(User::getCurrent() ? User::getCurrent()->getLogin() : '');
        $properties->setLastModifiedBy('DILPS');
        $properties->setTitle($title);
        $properties->setSubject('Généré par le système DILPS');
        $properties->setDescription("Certaines images sont soumises aux droits d'auteurs. Vous pouvez nous contactez à diatheque@unil.ch pour plus d'informations.");
        $properties->setKeywords("Université de Lausanne, Section d'Histoire de l'art");
        $properties->setCategory("Histoire de l'art");

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

    /**
     * @param Worksheet $sheet
     */
    private function headers(Worksheet $sheet): void
    {
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Fichier image (avec ou sans extension)');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Titre');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Titre étendu');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Domaine');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Matériaux');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Période');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Date précise début');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Date précise fin');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Pays de découverte');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Site/Lieu de découverte');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Lieu de production');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Référence de l\'objet');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Type de document');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Auteur du document');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Année du document');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Latitude');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Longitude');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Précision');

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
