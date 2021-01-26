#! /usr/bin/env php
<?php

use Ecodev\Felix\Service\AbstractDatabase;

require_once 'server/cli.php';

AbstractDatabase::loadData($argv[1] ?? 'data/dump/db.backup.sql.gz');
