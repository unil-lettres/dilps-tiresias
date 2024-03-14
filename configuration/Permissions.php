<?php

declare(strict_types=1);

return [
    [
        'path' => 'logs',
        'permissions' => '0770',
        'recursive' => true,
    ],
    [
        'path' => 'data/dump',
        'permissions' => '0770',
        'recursive' => true,
    ],
    [
        'path' => 'data/cache',
        'permissions' => '0770',
        'recursive' => true,
    ],
    [
        'path' => 'data/tmp',
        'permissions' => '0770',
        'recursive' => true,
    ],
    [
        'path' => 'data/images',
        'permissions' => '0770',
        'recursive' => false,
    ],
    [
        'path' => 'htdocs/news-images',
        'permissions' => '0770',
        'recursive' => false,
    ],
    [
        'path' => 'htdocs/export',
        'permissions' => '0770',
        'recursive' => false,
    ],
    [
        'path' => 'bin/build.sh',
        'permissions' => '0770',
    ],
    [
        'path' => 'bin/check-files.php',
        'permissions' => '0770',
    ],
    [
        'path' => 'bin/delete-old-export.sh',
        'permissions' => '0770',
    ],
    [
        'path' => 'bin/dump-data.php',
        'permissions' => '0770',
    ],
    [
        'path' => 'bin/doctrine',
        'permissions' => '0750',
    ],
    [
        'path' => 'bin/load-data.php',
        'permissions' => '0770',
    ],
    [
        'path' => 'bin/load-test-data.php',
        'permissions' => '0770',
    ],
    [
        'path' => 'node_modules/.bin/*',
        'permissions' => '0770',
    ],
    [
        'path' => 'node_modules/@esbuild/linux-x64/bin/*',
        'permissions' => '0770',
    ],
    [
        'path' => 'bin/pre-commit.sh',
        'permissions' => '0770',
    ],
    [
        'path' => 'link-libraries.sh',
        'permissions' => '0770',
    ],
    [
        'path' => 'bin/graphql.php',
        'permissions' => '0770',
    ],
];
