<?php

declare(strict_types=1);

use Doctrine\Migrations\DependencyFactory;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Console\ConsoleRunner;

$container = require 'config/container.php';

// For Doctrine Migration return something custom
global $argv;
if (preg_match('~doctrine-migrations~', $argv[0])) {
    return $container->get(DependencyFactory::class);
}

$entityManager = $container->get(EntityManager::class);

return ConsoleRunner::createHelperSet($entityManager);
