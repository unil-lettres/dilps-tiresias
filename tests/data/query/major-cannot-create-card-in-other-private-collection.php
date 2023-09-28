<?php

declare(strict_types=1);

$args = require 'student-can-create-card.php';

// A private collection invisible to major
$args[0]['variables']['collection'] = 2000;

return [
    $args[0],
    [
        'errors' => [
            [
                'message' => 'Entity not found for class `Application\\Model\\Collection` and ID `2000`.',
                'extensions' => [
                    'category' => 'user',
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
