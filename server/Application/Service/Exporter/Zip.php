<?php

declare(strict_types=1);

namespace Application\Service\Exporter;

use Application\Model\Card;
use Application\Model\Export;
use Application\Model\User;
use Ecodev\Felix\Api\Exception;
use Ecodev\Felix\Service\ImageResizer;
use ZipArchive;

/**
 * Export multiples cards as zip file.
 */
class Zip implements Writer
{
    private ImageResizer $imageResizer;

    private ?ZipArchive $zip = null;

    private int $fileIndex = 0;

    private Export $export;

    public function __construct(ImageResizer $imageResizer)
    {
        $this->imageResizer = $imageResizer;
    }

    public function getExtension(): string
    {
        return 'zip';
    }

    public function initialize(Export $export, string $title): void
    {
        $this->fileIndex = 0;
        $this->export = $export;
        $this->zip = new ZipArchive();
        $result = $this->zip->open($export->getPath(), ZipArchive::CREATE | ZipArchive::OVERWRITE);

        if ($result !== true) {
            throw new Exception($this->zip->getStatusString());
        }
    }

    public function write(Card $card): void
    {
        $image = $this->insertImage($card);
        if ($this->export->isIncludeLegend()) {
            $this->insertLegend($card, $image);
        }
    }

    public function finalize(): void
    {
        if ($this->fileIndex === 0) {
            $this->zip->addFromString('readme.txt', "Aucune fiche n'était exportable. Probablement parce qu'aucune fiche n'avait d'images.");
        }

        $this->zip->close();
    }

    private function insertImage(Card $card): string
    {
        // Skip if no image
        if (!$card->hasImage() || !is_readable($card->getPath())) {
            return '';
        }

        if ($this->export->getMaxHeight()) {
            $path = $this->imageResizer->resize($card, $this->export->getMaxHeight(), false);
        } else {
            $path = $card->getPath();
        }

        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $filename = $card->getId() . ($extension ? '.' . $extension : '');
        $added = $this->zip->addFile($path, $filename);

        if ($added) {
            $this->zip->setCompressionIndex($this->fileIndex++, ZipArchive::CM_STORE);
        }

        return $filename;
    }

    private function insertLegend(Card $card, string $image): void
    {
        $html = '';
        $html .= '<!DOCTYPE html>';
        $html .= '<html lang="fr">';
        $html .= '<head>';
        $html .= '<title>Base de données ' . $this->export->getSite() . '</title>';
        $html .= '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
        $html .= '<meta name="author" content="' . (User::getCurrent() ? User::getCurrent()->getLogin() : '') . '" />';
        $html .= '<style>';
        $html .= '.detail table { margin:auto; padding:5px; background-color:#d8e7f3; }';
        $html .= '.detail th { width:150px; padding-right:5px; text-align:right; }';
        $html .= '.detail th:first-letter {text-transform:uppercase}';
        $html .= '.detail td { min-width: 500px }';
        $html .= '.detail img { max-width:800px; max-height:600px; }';
        $html .= '</style>';
        $html .= '</head><body>';
        $html .= '<div class="detail">';
        $html .= '<table>';
        $html .= '<tr><td colspan="2"><a href="' . $image . '"><img src="' . $image . '" alt="' . $card->getName() . '"/></a></td></tr>';

        $html .= $this->row('titre', $card->getName());
        $html .= $this->row('titre étendu', $card->getExpandedName());

        $artists = [];
        foreach ($card->getArtists() as $artist) {
            $artists[] = $artist->getName();
        }
        $html .= $this->row('artiste', implode('<br>', $artists));

        $html .= $this->row('supplément', $card->getAddition());
        $html .= $this->row('datation', $card->getDating());
        $html .= $this->row('technique', $card->getTechnique());
        $html .= $this->row('matériel', $card->getMaterial());
        $html .= $this->row('format', $card->getFormat());
        $html .= $this->row('adresse', implode(', ', array_filter([$card->getStreet(), $card->getPostcode(), $card->getLocality(), $card->getArea(), $card->getCountry() ? $card->getCountry()->getName() : ''])));
        $html .= $this->row('institution', $card->getInstitution() ? $card->getInstitution()->getName() : '');
        $html .= $this->row('literature', $card->getLiterature());
        $html .= $this->row('page', $card->getPage());
        $html .= $this->row('planche', $card->getFigure());
        $html .= $this->row('table', $card->getTable());
        $html .= $this->row('ISBN', $card->getIsbn());

        $html .= '</table>';
        $html .= '</div>';
        $html .= '</body></html>';

        $added = $this->zip->addFromString($card->getId() . '.html', $html);

        if ($added) {
            $this->zip->setCompressionIndex($this->fileIndex++, ZipArchive::CM_STORE);
        }
    }

    private function row(string $label, string $value): string
    {
        if (!$value) {
            return '';
        }

        return '<tr><th>' . $label . '</th><td>' . $value . '</td></tr>' . PHP_EOL;
    }
}
