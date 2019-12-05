#! /usr/bin/env php
<?php

use Application\Service\AbstractDatabase;

require __DIR__ . '/../htdocs/index.php';

AbstractDatabase::dumpData($argv[1] ?? 'data/dump/db.backup.sql.gz');
