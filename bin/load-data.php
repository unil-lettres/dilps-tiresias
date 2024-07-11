#! /usr/bin/env php
<?php

declare(strict_types=1);

use Ecodev\Felix\Service\AbstractDatabase;

require_once 'server/cli.php';

AbstractDatabase::loadData($argv[1] ?? 'data/dump/db.backup.sql.gz');
