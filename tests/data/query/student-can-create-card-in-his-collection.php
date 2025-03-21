<?php

declare(strict_types=1);

$args = require 'student-can-create-card.php';

// The student private collection
$args[0]['variables']['collection'] = 2000;

return [
    $args[0],
    [
        'data' => [
            'createCard' => [
                'name' => 'test name',
                'fileSize' => 97599,
                'width' => 960,
                'height' => 425,
                'code' => null,
                'artists' => [
                    [
                        'name' => 'Test artist 3000',
                    ],
                    [
                        'name' => 'New artist',
                    ],
                ],
                'collections' => [
                    [
                        'id' => 2000,
                    ],
                ],
            ],
        ],
    ],
];
