#! /usr/bin/env php
<?php

use Application\Service\AbstractDatabase;

require __DIR__ . '/../htdocs/index.php';

AbstractDatabase::executeLocalCommand(PHP_BINARY . ' ./vendor/bin/doctrine orm:schema-tool:drop --ansi --full-database --force');
AbstractDatabase::executeLocalCommand(PHP_BINARY . ' ./vendor/bin/doctrine-migrations migrations:migrate --ansi --no-interaction');
AbstractDatabase::executeLocalCommand(PHP_BINARY . ' ./vendor/bin/doctrine dbal:import --ansi tests/data/fixture.sql');
