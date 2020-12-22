<?php

declare(strict_types=1);

namespace Application\Service\Exporter;

use Application\Handler\TemplateHandler;
use Application\Model\AbstractModel;
use Application\Model\Card;
use Application\Model\Country;
use Application\Model\DocumentType;
use Application\Model\Export;
use Application\Traits\HasParentInterface;
use Doctrine\Common\Collections\Collection;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Export multiples cards as XLSX file
 */
class Xlsx implements Writer
{
    private int $row = 1;

    private int $col = 1;

    private Export $export;

    private Worksheet $sheet;

    private Spreadsheet $spreadsheet;

    public function getExtension(): string
    {
        return 'xlsx';
    }

    public function initialize(Export $export, string $title): void
    {
        $this->row = 1;
        $this->col = 1;
        $this->export = $export;

        $this->spreadsheet = TemplateHandler::createSpreadsheet($export->getCreator(), $export->getSite(), $title);
        $this->sheet = $this->spreadsheet->getActiveSheet();

        $this->headers();
    }

    public function finalize(): void
    {
        // Everything wraps text
        $style = $this->sheet->getStyleByColumnAndRow(1, 1, $this->col, $this->row);
        $style->getAlignment()->setWrapText(true);

        // Write to disk
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($this->spreadsheet);
        $writer->save($this->export->getPath());
    }

    private function headers(): void
    {
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Id');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Titre');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Titre étendu');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Domaine');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Période');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Date précise début');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Date précise fin');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Pays de découverte');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Site/Lieu de découverte');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Lieu de production');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Référence de l\'objet');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Type de document');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Auteur du document');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Année du document');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Latitude');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Longitude');
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Précision');

        $style = $this->sheet->getStyleByColumnAndRow(1, $this->row, $this->col, $this->row);
        $style->getFont()->setBold(true);

        // Adjust column width
        for ($col = 1; $col < $this->col; ++$col) {
            if ($col !== 3) {
                $this->sheet->getColumnDimensionByColumn($col)->setAutoSize(true);
            } else {
                $this->sheet->getColumnDimensionByColumn($col)->setWidth(50);
            }
        }

        $this->sheet->freezePaneByColumnAndRow(1, $this->row + 1);

        ++$this->row;
    }

    public function write(Card $card): void
    {
        $this->col = 1;
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getId());
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getName());
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getExpandedName());
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $this->collection($card->getDomains()));
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $this->collection($card->getPeriods()));
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getFrom());
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getTo());
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $this->nullableName($card->getCountry()));
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getLocality());
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getProductionPlace());
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getObjectReference());
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $this->nullableName($card->getDocumentType()));
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getTechniqueAuthor());
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getTechniqueDate());
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getLatitude());
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getLongitude());
        $this->sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getPrecision());

        ++$this->row;
    }

    /**
     * @param null|Country|DocumentType $model
     */
    private function nullableName(?AbstractModel $model): string
    {
        return $model ? $model->getName() : '';
    }

    private function collection(Collection $collection): string
    {
        $lines = $collection->map(function ($model) {
            if ($model instanceof HasParentInterface) {
                $name = $model->getHierarchicName();
            } else {
                $name = $model->getName();
            }

            return '• ' . $name;
        })->toArray();

        sort($lines);

        return implode(PHP_EOL, $lines);
    }
}
