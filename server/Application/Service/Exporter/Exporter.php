<?php

declare(strict_types=1);

namespace Application\Service\Exporter;

use Application\DBAL\Types\ExportFormatType;
use Application\Model\Export;
use Application\Repository\CardRepository;
use Application\Repository\ExportRepository;
use Application\Service\MessageQueuer;
use Ecodev\Felix\Api\Exception;
use Ecodev\Felix\Service\Mailer;
use InvalidArgumentException;

class Exporter
{
    private ExportRepository $exportRepository;

    private CardRepository $cardRepository;

    private MessageQueuer $messageQueuer;

    private Mailer $mailer;

    private Writer $zip;

    private Writer $pptx;

    private Writer $xlsx;

    private string $phpPath;

    public function __construct(
        ExportRepository $exportRepository,
        CardRepository $cardRepository,
        MessageQueuer $messageQueuer,
        Mailer $mailer,
        Writer $zip,
        Writer $pptx,
        Writer $xlsx,
        string $phpPath
    ) {
        $this->exportRepository = $exportRepository;
        $this->cardRepository = $cardRepository;
        $this->messageQueuer = $messageQueuer;
        $this->mailer = $mailer;
        $this->zip = $zip;
        $this->pptx = $pptx;
        $this->xlsx = $xlsx;
        $this->phpPath = $phpPath;
    }

    /**
     * Export asynchronously in a separate process.
     *
     * This should be the preferred way to do big export
     */
    public function exportAsync(Export $export): void
    {
        $args = [
            realpath('bin/export.php'),
            $export->getId(),
        ];

        $escapedArgs = array_map('escapeshellarg', $args);

        $cmd = escapeshellcmd($this->phpPath) . ' ' . implode(' ', $escapedArgs) . ' > /dev/null 2>&1 &';
        exec($cmd);
    }

    /**
     * Export immediately and return the v $export object
     *
     * Because this method will indirectly clear the EntityManager any existing object
     * before calling this method will become invalid and must be re-fetched from DB.
     */
    public function export(Export $export): Export
    {
        $export->markAsInProgress();
        _em()->flush();

        $writer = $this->getWriter($export);
        $title = $export->getSite() . '-' . $export->getId();

        // Poor man's security by using hard-to-guess suffix
        $suffix = bin2hex(random_bytes(5));

        $filename = $title . '-' . $suffix . '.' . $writer->getExtension();
        $export->setFilename($filename);

        $writer->initialize($export, $title);
        $this->writeCards($writer, $export);
        $writer->finalize();

        $reloadExport = $this->exportRepository->findOneById($export->getId());
        $reloadExport->markAsDone();
        _em()->flush();

        return $reloadExport;
    }

    /**
     * Export immediately and send an email to the export creator.
     *
     * This must only be used via CRON jobs, because export might be very long (several minutes)
     * and the email is sent synchronously
     */
    public function exportAndSendMessage(int $id): void
    {
        /** @var null|Export $export */
        $export = $this->exportRepository->findOneById($id);
        if (!$export) {
            throw new InvalidArgumentException('Could not find export with ID: ' . $id);
        }

        $export = $this->export($export);

        $user = $export->getCreator();
        $message = $this->messageQueuer->queueExportDone($user, $export);

        $this->mailer->sendMessage($message);
    }

    private function getWriter(Export $export): Writer
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

    /**
     * Write all cards in small batches to avoid exploding PHP memory
     */
    private function writeCards(Writer $writer, Export $export): void
    {
        $totalRecordsProcessed = 0;
        while (true) {
            $cards = $this->cardRepository->getExportCards($export, $totalRecordsProcessed);

            // If nothing to process anymore, stop the whole thing
            if (!$cards) {
                break;
            }

            foreach ($cards as $card) {
                $writer->write($card);

                ++$totalRecordsProcessed;
            }

            _em()->flush();
            _em()->clear();
        }
    }
}
