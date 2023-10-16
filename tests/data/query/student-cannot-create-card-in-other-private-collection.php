<?php

declare(strict_types=1);

$args = require 'student-can-create-card.php';

// A private collection invisible to student
$args[0]['variables']['collection'] = 2003;

return [
    $args[0],
    [
        'errors' => [
            [
                'message' => 'Entity not found for class `Application\\Model\\Collection` and ID `2003`.',
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
