#! /usr/bin/env php
<?php

use Application\Service\Exporter\Exporter;

$container = require_once 'server/cli.php';

$id = (int) $argv[1] ?? null;
if (!$id) {
    throw new InvalidArgumentException('Specify the ID of the export to be exported');
}

/** @var Exporter $exporter */
$exporter = $container->get(Exporter::class);
$exporter->exportAndSendMessage($id);
