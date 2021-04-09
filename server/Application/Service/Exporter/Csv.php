<?php

declare(strict_types=1);

namespace Application\Service\Exporter;

use Application\Model\AbstractModel;
use Application\Model\Card;
use Application\Model\Country;
use Application\Model\DocumentType;
use Application\Model\Export;
use Application\Traits\HasParentInterface;
use Doctrine\Common\Collections\Collection;
use Ecodev\Felix\Api\Exception;

/**
 * Export multiples cards as CSV file
 */
class Csv implements Writer
{
    /**
     * @var resource
     */
    private $file;

    public function getExtension(): string
    {
        return 'csv';
    }

    public function initialize(Export $export, string $title): void
    {
        $file = fopen($export->getPath(), 'w+b');
        if ($file === false) {
            throw new Exception('Cannot write to file');
        }

        $this->file = $file;

        $this->headers();
    }

    public function finalize(): void
    {
        fclose($this->file);
    }

    private function writeRow(array $row): void
    {
        fputcsv($this->file, $row);
    }

    private function headers(): void
    {
        $this->writeRow([
            'Id',
            'Titre',
            'Titre étendu',
            'Domaine',
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
        ]);
    }

    public function write(Card $card): void
    {
        $this->writeRow([
            $card->getId(),
            $card->getName(),
            $card->getExpandedName(),
            $this->collection($card->getDomains()),
            $this->collection($card->getPeriods()),
            $card->getFrom(),
            $card->getTo(),
            $this->nullableName($card->getCountry()),
            $card->getLocality(),
            $card->getProductionPlace(),
            $card->getObjectReference(),
            $this->nullableName($card->getDocumentType()),
            $card->getTechniqueAuthor(),
            $card->getTechniqueDate(),
            $card->getLatitude(),
            $card->getLongitude(),
            $card->getPrecision(),
        ]);
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
