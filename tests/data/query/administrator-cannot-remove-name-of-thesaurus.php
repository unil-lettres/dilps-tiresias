<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            updateTag(id: 4000, input: {name: ""}) { id }
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
                    'updateTag',
                ],
            ],
        ],
    ],
];
