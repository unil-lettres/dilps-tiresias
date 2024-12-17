<?php

declare(strict_types=1);

namespace ApplicationTest\Service\Exporter;

use Application\Model\Card;
use Application\Service\Exporter\Pptx;
use Application\Service\ImageResizer;
use ApplicationTest\Traits\TestWithTransaction;
use Imagine\Image\ImagineInterface;
use PhpOffice\PhpPresentation\PhpPresentation;
use PhpOffice\PhpPresentation\Reader\PowerPoint2007;
use ZipArchive;

class PptxTest extends AbstractWriter
{
    use TestWithTransaction;

    public function testWrite(): void
    {
        global $container;

        $imagine = $container->get(ImagineInterface::class);

        $imageResizer = $this->createMock(ImageResizer::class);
        $imageResizer->expects(self::atLeastOnce())
            ->method('resize')
            // Never resize anything
            ->willReturnCallback(fn (Card $card, int $maxHeight, bool $useWebp): string => $card->getPath());

        $writer = new Pptx($imageResizer, $imagine);
        $tempFile = tempnam('data/tmp/', 'Pptx');

        $this->export($writer, $tempFile);

        $presentation = $this->readPresentation($tempFile);
        self::assertSame(1, $presentation->getSlideCount());
    }

    private function readPresentation(string $filename): PhpPresentation
    {
        // Assert that it is a valid ZIP file to prevent PhpSpreadsheet from hanging
        $zip = new ZipArchive();
        $res = $zip->open($filename, ZipArchive::CHECKCONS);
        self::assertTrue($res, 'exported Excel should be a valid ZIP file');
        $zip->close();

        // Re-read it
        $reader = new PowerPoint2007();
        $spreadsheet = $reader->load($filename);
        unlink($filename);

        return $spreadsheet;
    }
}
