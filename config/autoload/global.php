<?php

declare(strict_types=1);

/**
 * Default configuration that can be overridden by a local.php, but it at least ensure
 * that required keys exist with "safe" values.
 */

return [
    'hostname' => 'dilps.lan',
    'phpPath' => '/usr/bin/php7.4',
    'files' => [
        'unlink' => true,
    ],
    'templates' => [
        'paths' => [
            'app' => ['server/templates/app'],
            'error' => ['server/templates/error'],
            'layout' => ['server/templates/layout'],
        ],
    ],
    'smtp' => null,
    'email' => [
        'from' => 'noreply@dilps.lan', // Sender for emails
        'toOverride' => null, // Override recipient (TO) address of all emails, useful for testing
    ],
];
