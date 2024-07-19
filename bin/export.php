#! /usr/bin/env php
<?php

declare(strict_types=1);

use Application\Service\Exporter\Exporter;

$container = require_once 'server/cli.php';

$id = (int) ($argv[1] ?? null);
if (!$id) {
    throw new InvalidArgumentException('Specify the ID of the export to be exported');
}

// @var Exporter $exporter
try {
    $exporter = $container->get(Exporter::class);
    $exporter->exportAndSendMessage($id);
} catch (Throwable $throwable) {
    _log()->err($throwable->getMessage() . "\n\n" . $throwable->getTraceAsString());
    echo $throwable->getMessage() . PHP_EOL;
    exit(1);
}
