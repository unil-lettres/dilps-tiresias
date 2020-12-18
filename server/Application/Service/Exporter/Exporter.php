<?php

declare(strict_types=1);

namespace Application\Service\Exporter;

use Application\DBAL\Types\ExportFormatType;
use Application\DBAL\Types\ExportStateType;
use Application\Model\Export;
use Ecodev\Felix\Api\Exception;

class Exporter
{
    private Writer $zip;

    private Writer $pptx;

    private Writer $xlsx;

    public function __construct(Writer $zip, Writer $pptx, Writer $xlsx)
    {
        $this->zip = $zip;
        $this->pptx = $pptx;
        $this->xlsx = $xlsx;
    }

    public function export(Export $export): void
    {
        $export->setState(ExportStateType::IN_PROGRESS);
        _em()->flush();

        $writer = $this->getWriter($export);
        $title = $export->getSite() . '-' . $export->getId();

        // Poor man's security by using hard-to-guess suffix
        $suffix = bin2hex(random_bytes(5));

        $filename = $title . '-' . $suffix . '.' . $writer->getExtension();
        $export->setFilename($filename);
        $writer->write($export, $title);

        $export->setState(ExportStateType::DONE);
        $export->setFileSize(filesize($export->getPath()));
        _em()->flush();
    }

    public function getWriter(Export $export): Writer
    {
        switch ($export->getFormat()) {
            case ExportFormatType::ZIP:
                return $this->zip;
            case ExportFormatType::PPTX:
                return $this->pptx;
            case ExportFormatType::XLSX:
                return $this->xlsx;
            default:
                throw new Exception('Invalid export format:' . $export->getFormat());
        }
    }
}
