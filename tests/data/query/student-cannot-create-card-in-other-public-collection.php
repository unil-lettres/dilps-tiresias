<?php

declare(strict_types=1);

$args = require 'tests/data/query/student-can-create-card.php';

// A public collection visible to student, but not mutable
$args[0]['variables']['collection'] = 2001;

return [
    $args[0],
    [
        'errors' => [
            [
                'message' => 'User "student" with role student is not allowed on resource "Collection#2001" with privilege "linkCard"',
                'extensions' => [
                    'category' => 'Permissions',
                ],
                'locations' => [
                    [
                        'line' => 2,
                        'column' => 13,
                    ],
                ],
                'path' => [
                    'createCard',
                ],
            ],
        ],
    ],
];
