#! /usr/bin/env php
<?php

/**
 * A script to show missing files on disk and non-needed files on disk.
 *
 * It is up to the user to then take appropriate action based on that information.
 */

use Ecodev\Felix\Service\FileChecker;

require_once 'server/cli.php';

$checker = new FileChecker(_em()->getConnection());

$checker->check([
    'card' => 'data/images/',
]);
