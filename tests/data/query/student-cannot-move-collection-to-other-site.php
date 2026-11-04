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
                'message' => "Impossible de déplacer un élément vers l'autre site.",
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
