<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            createCollection(input: {name: "   ", site: Dilps}) { id }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'Le nom est obligatoire.',
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
                    'createCollection',
                ],
            ],
        ],
    ],
];
