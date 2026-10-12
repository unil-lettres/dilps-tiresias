<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            createCollection(input: {name: "public collection", site: Dilps, visibility: Member}) {
                visibility
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'Only seniors, majors and administrators can make a collection visible to others than its members',
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
