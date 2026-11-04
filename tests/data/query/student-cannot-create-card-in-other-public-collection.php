<?php

declare(strict_types=1);

$args = require 'student-can-create-card.php';

// A public collection visible to student, but not mutable
$args[0]['variables']['collection'] = 2001;

return [
    $args[0],
    [
        'errors' => [
            [
                'message' => "Vous n'avez pas le droit de modifier le contenu de cette collection.",
                'extensions' => [
                    'showSnack' => true,
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
