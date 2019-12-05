<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\Card;
use Application\Model\User;
use Application\Service\ImageService;
use Application\Stream\TemporaryFile;
use Imagine\Image\ImagineInterface;
use PhpOffice\PhpPresentation\DocumentLayout;
use PhpOffice\PhpPresentation\PhpPresentation;
use PhpOffice\PhpPresentation\Shape\RichText;
use PhpOffice\PhpPresentation\Shape\RichText\Run;
use PhpOffice\PhpPresentation\Slide;
use PhpOffice\PhpPresentation\Style\Alignment;
use PhpOffice\PhpPresentation\Style\Color;
use PhpOffice\PhpPresentation\Writer\PowerPoint2007;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response;

/**
 * Serve multiples cards as PowerPoint file
 */
class PptxAction extends AbstractAction
{
    private const MARGIN = 10;
    private const LEGEND_HEIGHT = 75;

    /**
     * @var ImagineInterface
     */
    private $imagine;

    /**
     * @var ImageService
     */
    private $imageService;

    /**
     * @var bool
     */
    private $needSeparator = false;

    /**
     * @var string
     */
    private $textColor = Color::COLOR_WHITE;

    /**
     * @var string
     */
    private $backgroundColor = Color::COLOR_BLACK;

    public function __construct(ImageService $imageService, ImagineInterface $imagine)
    {
        $this->imageService = $imageService;
        $this->imagine = $imagine;
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
        $this->textColor = $request->getAttribute('textColor', $this->textColor);
        $this->backgroundColor = $request->getAttribute('backgroundColor', $this->backgroundColor);
        $cards = $request->getAttribute('cards');

        $title = 'DILPS ' . date('c', time());
        $presentation = $this->export($cards, $title);

        // Write to disk
        $tempFile = tempnam('data/tmp/', 'pptx');
        $writer = new PowerPoint2007($presentation);
        $writer->save($tempFile);

        $headers = [
            'content-type' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'content-length' => filesize($tempFile),
            'content-disposition' => 'inline; filename="' . $title . '.pptx"',
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
     * @return PhpPresentation
     */
    private function export(array $cards, string $title): PhpPresentation
    {
        $presentation = new PhpPresentation();

        // Set a few meta data
        $properties = $presentation->getDocumentProperties();
        $properties->setCreator(User::getCurrent() ? User::getCurrent()->getLogin() : '');
        $properties->setLastModifiedBy('DILPS');
        $properties->setTitle($title);
        $properties->setSubject('Présentation PowerPoint générée par le système DILPS');
        $properties->setDescription("Certaines images sont soumises aux droits d'auteurs. Vous pouvez nous contactez à diatheque@unil.ch pour plus d'informations.");
        $properties->setKeywords("Université de Lausanne, Section d'Histoire de l'art");
        $properties->setCategory("Histoire de l'art");

        // Remove default slide
        $presentation->removeSlideByIndex(0);

        foreach ($cards as $card) {
            $this->exportCard($presentation, $card);
        }

        return $presentation;
    }

    private function exportCard(PhpPresentation $presentation, Card $card): void
    {
        // Skip if no image
        if (!$card->hasImage() || !is_readable($card->getPath())) {
            return;
        }

        // Create slide
        $slide = $presentation->createSlide();
        $slide->setBackground();

        // Set background color
        $backgroundColor = new \PhpOffice\PhpPresentation\Slide\Background\Color();
        $backgroundColor->setColor(new Color($this->backgroundColor));
        $slide->setBackground($backgroundColor);

        $this->insertImage($slide, $card);
        $this->insertLegend($slide, $card);
    }

    private function insertImage(Slide $slide, Card $card): void
    {
        $path = $this->imageService->resize($card, 1200);

        // Get dimensions
        $image = $this->imagine->open($path);
        $size = $image->getSize();
        $width = $size->getWidth();
        $height = $size->getHeight();
        $ratio = $width / $height;

        // Get available space for our image
        $availableWidth = $slide->getParent()->getLayout()->getCX(DocumentLayout::UNIT_PIXEL);
        $availableHeight = $slide->getParent()->getLayout()->getCY(DocumentLayout::UNIT_PIXEL) - self::LEGEND_HEIGHT - 2 * self::MARGIN;
        $availableRatio = $availableWidth / $availableHeight;

        $shape = $slide->createDrawingShape();
        $shape->setPath($path);

        if ($ratio > $availableRatio) {
            $shape->setWidth($availableWidth - 2 * self::MARGIN);
            $shape->setOffsetX(self::MARGIN);
            $shape->setOffsetY(($availableHeight - $shape->getHeight()) / 2 + self::MARGIN);
        } else {
            $shape->setHeight($availableHeight - 2 * self::MARGIN);
            $shape->setOffsetX(($availableWidth - $shape->getWidth()) / 2 + self::MARGIN);
            $shape->setOffsetY(self::MARGIN);
        }
    }

    private function insertLegend(Slide $slide, Card $card): void
    {
        $shape = $slide->createRichTextShape();
        $shape->setHeight(self::LEGEND_HEIGHT);
        $shape->setWidth($slide->getParent()->getLayout()->getCX(DocumentLayout::UNIT_PIXEL) - 2 * self::MARGIN);
        $shape->setOffsetX(self::MARGIN);
        $shape->setOffsetY($slide->getParent()->getLayout()->getCY(DocumentLayout::UNIT_PIXEL) - self::LEGEND_HEIGHT - self::MARGIN);
        $shape->getActiveParagraph()->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $this->needSeparator = false;
        foreach ($card->getArtists() as $artist) {
            $this->appendText($shape, true, true, false, str_replace(', ', ' ', $artist->getName()));
        }

        $this->appendText($shape, true, false, true, $card->getName());
        $this->appendText($shape, true, false, false, $card->getDating());
        $shape->createBreak();
        $this->needSeparator = false;
        $this->appendText($shape, false, false, false, $card->getMaterial());
        $this->appendText($shape, false, false, false, $card->getFormat());
        $this->appendText($shape, false, false, false, $card->getLocality());

        if ($card->getInstitution()) {
            $this->appendText($shape, false, false, false, $card->getInstitution()->getName());
        }
    }

    private function appendText(RichText $shape, bool $big, bool $bold, bool $italic, string $value): void
    {
        if (!$value) {
            return;
        }

        $value = strip_tags($value);

        if ($this->needSeparator) {
            $textRun = $shape->createTextRun(', ');
            $this->setFont($textRun, $big, false, false);
        }

        $textRun = $shape->createTextRun($value);
        $this->setFont($textRun, $big, $bold, $italic);

        $this->needSeparator = true;
    }

    private function setFont(Run $textRun, bool $big, bool $bold, bool $italic): void
    {
        $font = $textRun->getFont();
        $font->setSize($big ? 14 : 12);
        $font->setColor(new Color($this->textColor));
        $font->setBold($bold);
        $font->setItalic($italic);
    }
}
