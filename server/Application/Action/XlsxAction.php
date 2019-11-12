<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\AbstractModel;
use Application\Model\Card;
use Application\Model\User;
use Application\Stream\TemporaryFile;
use Application\Traits\HasParentInterface;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response;

/**
 * Serve multiples cards as XLSX file
 */
class XlsxAction extends AbstractAction
{
    /**
     * @var int
     */
    private $row = 1;

    /**
     * @var int
     */
    private $col = 1;

    public function __construct()
    {
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
        $cards = $request->getAttribute('cards');

        $title = 'DILPS ' . date('c', time());
        $spreadsheet = $this->export($cards, $title);

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
    private function export(array $cards, string $title): Spreadsheet
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

        foreach ($cards as $card) {
            $this->exportCard($sheet, $card);
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
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Id');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Titre');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Titre étendu');
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, 'Domaine');
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

    private function exportCard(Worksheet $sheet, Card $card): void
    {
        $this->col = 1;
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getId());
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getName());
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getExpandedName());
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $this->hierarchy($card->getDomain()));
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $this->collection($card->getPeriods()));
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getFrom());
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getTo());
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $this->nullable($card->getCountry()));
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getLocality());
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getProductionPlace());
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getObjectReference());
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $this->nullable($card->getDocumentType()));
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getTechniqueAuthor());
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getTechniqueDate());
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getLatitude());
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getLongitude());
        $sheet->setCellValueByColumnAndRow($this->col++, $this->row, $card->getPrecision());

        ++$this->row;
    }

    private function nullable(?AbstractModel $model): string
    {
        return $model ? $model->getName() : '';
    }

    private function collection(\Doctrine\Common\Collections\Collection $collection): string
    {
        $lines = $collection->map(function ($model) {
            if ($model instanceof HasParentInterface) {
                $name = $this->hierarchy($model);
            } else {
                $name = $model->getName();
            }

            return '• ' . $name;
        })->toArray();

        sort($lines);

        return implode(PHP_EOL, $lines);
    }

    private function hierarchy(?HasParentInterface $m): string
    {
        $result = [];
        while ($m) {
            $result[] = $m->getName();
            $m = $m->getParent();
        }

        return implode(' > ', array_reverse($result));
    }
}
