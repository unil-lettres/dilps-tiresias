<?php

declare(strict_types=1);
// Route like Apache does in configuration/apache.conf, for the PHP built-in webserver
if (PHP_SAPI === 'cli-server') {
    // Serve both sites on the same port, like the virtual hosts of Apache
    $_SERVER['SERVER_NAME'] = parse_url('//' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST);
    putenv('SERVER_NAME=' . $_SERVER['SERVER_NAME']);

    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (is_file(__DIR__ . $path)) {
        return false;
    }

    if (!preg_match('~^/(graphql|auth|detail/?|api/.*)$~', $path)) {
        readfile(__DIR__ . '/index.html');

        return;
    }
}

chdir(dirname(__DIR__));
require 'vendor/autoload.php';

// Self-called anonymous function that creates its own scope and keep the global namespace clean.
(function (): void {
    /** @var Psr\Container\ContainerInterface $container */
    $container = require 'config/container.php';

    /** @var Mezzio\Application $app */
    $app = $container->get(Mezzio\Application::class);
    $factory = $container->get(Mezzio\MiddlewareFactory::class);

    // Execute programmatic/declarative middleware pipeline and routing
    // configuration statements
    (require 'config/pipeline.php')($app, $factory, $container);
    (require 'config/routes.php')($app, $factory, $container);

    // we only run the application if this file was NOT included (otherwise, the file was included to access misc functions)
    if (realpath(__FILE__) === realpath($_SERVER['SCRIPT_FILENAME'])) {
        $app->run();
    }
})();
