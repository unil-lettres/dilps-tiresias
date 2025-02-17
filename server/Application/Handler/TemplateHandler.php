<?php

declare(strict_types=1);

namespace Application\Handler;

use Application\Enum\Precision;
use Application\Enum\Site;
use Application\Model\User;
use Application\Repository\CountryRepository;
use Application\Repository\DocumentTypeRepository;
use Application\Repository\DomainRepository;
use Application\Repository\MaterialRepository;
use Application\Repository\PeriodRepository;
use Application\Stream\TemporaryFile;
use Laminas\Diactoros\Response;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\NamedRange;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Serve XLSX template file.
 */
class TemplateHandler implements RequestHandlerInterface
{
    final public const HEADERS = [
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

    public function __construct(private readonly Site $site, private readonly DomainRepository $domainRepository, private readonly PeriodRepository $periodRepository, private readonly CountryRepository $countryRepository, private readonly MaterialRepository $materialRepository, private readonly DocumentTypeRepository $documentTypeRepository)
    {
    }

    /**
     * Serve multiples cards as PowerPoint file.
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $spreadsheet = $this->export();

        return $this->createResponse($spreadsheet);
    }

    /**
     * Export all cards into a presentation.
     */
    private function export(): Spreadsheet
    {
        $title = $this->site->getDescription() . '_' . date('c', time());

        $spreadsheet = self::createSpreadsheet(User::getCurrent(), $this->site, $title);
        $sheet = $spreadsheet->getActiveSheet();

        $this->headers($sheet);

        $domainName = 'Domaines';
        $domains = $this->domainRepository->getFullNames($this->site);
        $this->createList($spreadsheet, array_keys($domains), $domainName);

        $materialName = 'Matériaux';
        $materials = $this->materialRepository->getFullNames($this->site);
        $this->createList($spreadsheet, array_keys($materials), $materialName);

        $periodName = 'Périodes';
        $periods = $this->periodRepository->getFullNames($this->site);
        $this->createList($spreadsheet, array_keys($periods), $periodName);

        $documentTypeName = 'Document';
        $documentTypes = $this->documentTypeRepository->getNames($this->site);
        $this->createList($spreadsheet, array_keys($documentTypes), $documentTypeName);

        $countryName = 'Pays';
        $countries = $this->countryRepository->getNames();
        $this->createList($spreadsheet, array_keys($countries), $countryName);

        $precisionName = 'Précisions';
        $precisions = [
            Precision::Locality->value,
            Precision::Site->value,
            Precision::Building->value,
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

        $style = $sheet->getStyle([1, 1, $this->col, $this->row]);
        $style->getAlignment()->setWrapText(true);

        return $spreadsheet;
    }

    private function headers(Worksheet $sheet): void
    {
        foreach (self::HEADERS as $header) {
            $sheet->setCellValue([$this->col++, $this->row], $header);
        }

        $style = $sheet->getStyle([1, $this->row, $this->col, $this->row]);
        $style->getFont()->setBold(true);

        // Adjust column width
        for ($col = 1; $col < $this->col; ++$col) {
            if ($col !== 3) {
                $sheet->getColumnDimensionByColumn($col)->setAutoSize(true);
            } else {
                $sheet->getColumnDimensionByColumn($col)->setWidth(50);
            }
        }

        $sheet->freezePane([1, $this->row + 1]);

        ++$this->row;
    }

    private function createList(Spreadsheet $spreadsheet, array $data, string $name): string
    {
        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle($name);
        $row = 1;
        foreach ($data as $d) {
            $sheet->setCellValue([1, $row++], $d);
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
            ->getCell([$this->col++, $this->row])
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

    public static function createSpreadsheet(?User $user, Site $site, string $title): Spreadsheet
    {
        $spreadsheet = new Spreadsheet();

        // Set a few meta data
        $properties = $spreadsheet->getProperties();
        $properties->setCreator($user ? $user->getLogin() : '');
        $properties->setLastModifiedBy($site->getDescription());
        $properties->setTitle($title);
        $properties->setSubject('Généré par le système ' . $site->getDescription());
        $properties->setDescription("Certaines images sont soumises aux droits d'auteurs. Vous pouvez nous contactez à diatheque@unil.ch pour plus d'informations.");
        $properties->setKeywords('Université de Lausanne');

        return $spreadsheet;
    }

    private function createResponse(Spreadsheet $spreadsheet): ResponseInterface
    {
        // Write to disk
        $tempFile = tempnam('data/tmp/', 'xlsx');

        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);

        $headers = [
            'content-type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'content-length' => filesize($tempFile),
            'content-disposition' => 'inline; filename="' . $spreadsheet->getProperties()->getTitle() . '.xlsx"',
        ];

        $stream = new TemporaryFile($tempFile);
        $response = new Response($stream, 200, $headers);

        return $response;
    }
}
