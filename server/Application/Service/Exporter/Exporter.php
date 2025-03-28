<?php

declare(strict_types=1);

namespace Application\Service\Exporter;

use Application\Enum\ExportFormat;
use Application\Model\Export;
use Application\Model\User;
use Application\Repository\CardRepository;
use Application\Repository\ExportRepository;
use Application\Service\MessageQueuer;
use Ecodev\Felix\Service\Mailer;
use InvalidArgumentException;
use Throwable;

class Exporter
{
    public function __construct(
        private readonly ExportRepository $exportRepository,
        private readonly CardRepository $cardRepository,
        private readonly MessageQueuer $messageQueuer,
        private readonly Mailer $mailer,
        private readonly Writer $zip,
        private readonly Writer $pptx,
        private readonly Writer $csv,
        private readonly string $phpPath
    ) {
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

        // Forward SERVER_NAME to CLI command
        $env = 'SERVER_NAME=' . escapeshellarg(getenv('SERVER_NAME'));

        $cmd = $env . ' ' . escapeshellcmd($this->phpPath) . ' ' . implode(' ', $escapedArgs) . ' > /dev/null 2>&1 &';
        exec($cmd);
    }

    /**
     * Export immediately and return the v $export object.
     *
     * Because this method will indirectly clear the EntityManager any existing object
     * before calling this method will become invalid and must be re-fetched from DB.
     */
    public function export(Export $export): Export
    {
        $writer = $this->getWriter($export);
        $title = $export->getSite()->value . '-' . $export->getId();

        // Poor man's security by using hard-to-guess suffix
        $suffix = bin2hex(random_bytes(5));

        $filename = $title . '-' . $suffix . '.' . $writer->getExtension();

        $export->markAsInProgress($filename);
        _em()->flush();

        try {
            $writer->initialize($export, $title);
            $this->writeCards($writer, $export);
            $writer->finalize();

            $reloadExport = $this->reloadExport($export);
            $reloadExport->markAsDone();
        } catch (Throwable $throwable) {
            $reloadExport = $this->reloadExport($export);
            $reloadExport->markAsErrored($throwable);

            throw $throwable;
        } finally {
            _em()->flush();
        }

        return $reloadExport;
    }

    private function reloadExport(Export $export): Export
    {
        User::reloadCurrentUser();

        return $this->exportRepository->findOneById($export->getId());
    }

    /**
     * Export immediately and send an email to the export creator.
     *
     * This must only be used via CLI, because export might be very long (several minutes)
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
        return match ($export->getFormat()) {
            ExportFormat::Zip => $this->zip,
            ExportFormat::Pptx => $this->pptx,
            ExportFormat::Csv => $this->csv,
        };
    }

    /**
     * Write all cards in small batches to avoid exploding PHP memory.
     */
    private function writeCards(Writer $writer, Export $export): void
    {
        $lastCardId = 0;
        while (true) {
            $cards = $this->cardRepository->getExportCards($export, $lastCardId);
            // If nothing to process anymore, stop the whole thing
            if (!$cards) {
                break;
            }

            foreach ($cards as $card) {
                $writer->write($card);
                $lastCardId = $card->getId();
            }

            _em()->flush();
            _em()->clear();
        }
    }
}
