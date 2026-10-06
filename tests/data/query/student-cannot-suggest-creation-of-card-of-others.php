<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            suggestCreation(id: 6006, request: "test request") {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'Only the creator of a card can submit it as a suggestion',
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
                    'suggestCreation',
                ],
            ],
        ],
    ],
];
