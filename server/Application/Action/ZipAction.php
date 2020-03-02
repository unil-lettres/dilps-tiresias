<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\Card;
use Application\Model\User;
use Application\Service\ImageService;
use Application\Stream\TemporaryFile;
use Imagine\Image\ImagineInterface;
use Laminas\Diactoros\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use ZipArchive;

/**
 * Serve multiples cards as zip file
 */
class ZipAction extends AbstractAction
{
    /**
     * @var ImagineInterface
     */
    private $imagine;

    /**
     * @var ImageService
     */
    private $imageService;

    /**
     * @var string
     */
    private $site;

    /**
     * @var bool
     */
    private $includeLegend = true;

    /**
     * @var null|int
     */
    private $maxHeight;

    /**
     * @var ZipArchive
     */
    private $zip;

    /**
     * @var int
     */
    private $fileIndex = 0;

    public function __construct(ImageService $imageService, ImagineInterface $imagine, string $site)
    {
        $this->imageService = $imageService;
        $this->imagine = $imagine;
        $this->site = $site;
    }

    /**
     * Serve multiples cards as zip file
     *
     * @param ServerRequestInterface $request
     * @param RequestHandlerInterface $handler
     *
     * @return ResponseInterface
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $this->includeLegend = (bool) $request->getAttribute('includeLegend', $this->includeLegend);
        $this->maxHeight = (int) $request->getAttribute('maxHeight', $this->maxHeight);
        $cards = $request->getAttribute('cards');

        // Write to disk
        $tempFile = tempnam('data/tmp/', 'zip');
        $title = $this->site . '_' . date('c', time());
        $this->export($cards, $tempFile);

        $headers = [
            'content-type' => 'application/zip',
            'content-length' => filesize($tempFile),
            'content-disposition' => 'inline; filename="' . $title . '.zip"',
        ];
        $stream = new TemporaryFile($tempFile);
        $response = new Response($stream, 200, $headers);

        return $response;
    }

    /**
     * Export all cards into a zip file
     *
     * @param Card[] $cards
     * @param string $file
     */
    private function export(array $cards, string $file): void
    {
        $this->zip = new ZipArchive();
        $this->zip->open($file);

        foreach ($cards as $card) {
            $image = $this->insertImage($card);
            if ($this->includeLegend) {
                $this->insertLegend($card, $image);
            }
        }

        $this->zip->close();
    }

    private function insertImage(Card $card): string
    {
        // Skip if no image
        if (!$card->hasImage() || !is_readable($card->getPath())) {
            return '';
        }

        if ($this->maxHeight) {
            $path = $this->imageService->resize($card, $this->maxHeight);
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
        $html .= '<title>Base de données ' . $this->site . '</title>';
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
