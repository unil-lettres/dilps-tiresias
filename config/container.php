<?php

declare(strict_types=1);

use Doctrine\ORM\EntityManager;
use GraphQL\Doctrine\Types;
use Laminas\ServiceManager\Config;
use Laminas\ServiceManager\ServiceManager;

require_once 'server/Debug.php';

// Secure cookie usage
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_samesite', 'Strict');

// Load configuration
$config = require __DIR__ . '/config.php';

// Build container
global $container;
$container = new ServiceManager();
(new Config($config['dependencies']))->configureServiceManager($container);

// Inject config
$container->setService('config', $config);

/**
 * Returns the type registry
 */
function _types(): Types
{
    global $container;

    return $container->get(Types::class);
}

/**
 * Returns the EM
 */
function _em(): EntityManager
{
    global $container;

    return $container->get(EntityManager::class);
}

return $container;
