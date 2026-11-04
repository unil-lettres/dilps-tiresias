<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            updateCollection(id: 2000, input: {site: Tiresias}) {
                site
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'Cannot move an object to another site',
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
                    'updateCollection',
                ],
            ],
        ],
    ],
];
