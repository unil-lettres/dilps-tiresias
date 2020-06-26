<?php

declare(strict_types=1);

$args = require 'tests/data/query/student-can-create-card.php';

// A public collection visible to major, not mutable itself, but still can add card to it
$args[0]['variables']['collection'] = 2001;

return [
    $args[0],
    [
        'data' => [
            'createCard' => [
                'name' => 'test name',
                'fileSize' => 90188,
                'width' => 960,
                'height' => 425,
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
                        'id' => 2001,
                    ],
                ],
            ],
        ],
    ],
];
