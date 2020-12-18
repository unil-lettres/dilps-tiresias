#! /usr/bin/env php
<?php

use Application\Model\Export;
use Application\Repository\ExportRepository;
use Application\Service\Exporter\Exporter;
use Application\Service\MessageQueuer;
use Ecodev\Felix\Service\Mailer;

$id = $argv[1] ?? null;
if (!$id) {
    throw new InvalidArgumentException('Specify the ID of the export to be exported');
}

$container = require_once 'server/cli.php';

/** @var ExportRepository $exportRepository */
$exportRepository = _em()->getRepository(Export::class);

/** @var null|Export $export */
$export = $exportRepository->findOneById($id);
if (!$export) {
    throw new InvalidArgumentException('Could not find export with ID: ' . $id);
}

/** @var Exporter $exporter */
$exporter = $container->get(Exporter::class);
$exporter->export($export);

/** @var MessageQueuer $messageQueuer */
$messageQueuer = $container->get(MessageQueuer::class);

$user = $export->getCreator();
$message = $messageQueuer->queueExportDone($user, $export);

/** @var Mailer $mailer */
$mailer = $container->get(Mailer::class);
$mailer->sendMessage($message);
