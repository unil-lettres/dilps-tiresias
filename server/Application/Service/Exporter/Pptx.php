<?php

declare(strict_types=1);

namespace Application\Service\Exporter;

use Application\Model\Card;
use Application\Model\Export;
use Application\Model\User;
use Ecodev\Felix\Service\ImageResizer;
use Imagine\Image\ImagineInterface;
use PhpOffice\PhpPresentation\DocumentLayout;
use PhpOffice\PhpPresentation\PhpPresentation;
use PhpOffice\PhpPresentation\Shape\RichText;
use PhpOffice\PhpPresentation\Shape\RichText\Run;
use PhpOffice\PhpPresentation\Slide;
use PhpOffice\PhpPresentation\Style\Alignment;
use PhpOffice\PhpPresentation\Style\Color;
use PhpOffice\PhpPresentation\Writer\PowerPoint2007;

/**
 * Export multiples cards as PowerPoint file.
 */
class Pptx implements Writer
{
    private const MARGIN = 10;
    private const LEGEND_HEIGHT = 75;

    private ImagineInterface $imagine;

    private ImageResizer $imageResizer;

    private bool $needSeparator = false;

    private string $textColor = Color::COLOR_WHITE;

    private string $backgroundColor = Color::COLOR_BLACK;

    private Export $export;

    private PhpPresentation $presentation;

    public function __construct(ImageResizer $imageResizer, ImagineInterface $imagine)
    {
        $this->imageResizer = $imageResizer;
        $this->imagine = $imagine;
    }

    public function getExtension(): string
    {
        return 'pptx';
    }

    public function initialize(Export $export, string $title): void
    {
        $this->needSeparator = false;
        $this->export = $export;
        $this->textColor = str_replace('#', 'FF', $export->getTextColor());
        $this->backgroundColor = str_replace('#', 'FF', $export->getBackgroundColor());

        $this->presentation = new PhpPresentation();

        // Set a few meta data
        $properties = $this->presentation->getDocumentProperties();
        $properties->setCreator(User::getCurrent() ? User::getCurrent()->getLogin() : '');
        $properties->setLastModifiedBy($this->export->getSite());
        $properties->setTitle($title);
        $properties->setSubject('Présentation PowerPoint générée par le système ' . $this->export->getSite());
        $properties->setDescription("Certaines images sont soumises aux droits d'auteurs. Vous pouvez nous contactez à diatheque@unil.ch pour plus d'informations.");
        $properties->setKeywords('Université de Lausanne');

        // Remove default slide
        $this->presentation->removeSlideByIndex(0);
    }

    public function write(Card $card): void
    {
        // Skip if no image
        if (!$card->hasImage() || !is_readable($card->getPath())) {
            return;
        }

        // Create slide
        $slide = $this->presentation->createSlide();
        $slide->setBackground();

        // Set background color
        $backgroundColor = new Slide\Background\Color();
        $backgroundColor->setColor(new Color($this->backgroundColor));
        $slide->setBackground($backgroundColor);

        $this->insertImage($slide, $card);
        $this->insertLegend($slide, $card);
    }

    public function finalize(): void
    {
        // Write to disk
        $writer = new PowerPoint2007($this->presentation);
        $writer->save($this->export->getPath());
    }

    private function insertImage(Slide $slide, Card $card): void
    {
        $path = $this->imageResizer->resize($card, 1200, false);

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
