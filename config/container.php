<?php

declare(strict_types=1);

use Ecodev\Felix\FatalErrorHandler;
use Laminas\ServiceManager\ServiceManager;

FatalErrorHandler::register();

// Secure cookie usage
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_samesite', 'Strict');

// Load configuration
$config = require __DIR__ . '/config.php';

$dependencies = $config['dependencies'];
$dependencies['services']['config'] = $config;

// Build container
global $container;
$container = new ServiceManager($dependencies);

return $container;
