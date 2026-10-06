<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            createCollection(input: {name: "fonds", site: Dilps, isSource: true, copyrights: "© Student"}) {
                isSource
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'Only administrators can change the isSource of a collection',
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
