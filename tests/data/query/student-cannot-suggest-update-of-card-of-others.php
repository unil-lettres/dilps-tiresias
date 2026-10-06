<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            suggestUpdate(id: 6006, request: "test request") {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => "Seul·e le·la créateur·rice d'une fiche peut la proposer.",
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
                    'suggestUpdate',
                ],
            ],
        ],
    ],
];
