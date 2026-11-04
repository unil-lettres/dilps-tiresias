<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            users(filter: {groups: [{conditions: [{email: {like: {value: "%junior%"}}}]}]}) { length }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'Seul·e·s les administrateur·rice·s peuvent filtrer ou trier par email.',
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
                    'users',
                ],
            ],
        ],
    ],
];
