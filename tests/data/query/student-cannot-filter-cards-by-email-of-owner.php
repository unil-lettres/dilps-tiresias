<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            cards(filter: {groups: [{joins: {owner: {conditions: [{email: {equal: {value: "junior-dilps@example.com"}}}]}}}]}) { length }
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
                    'cards',
                ],
            ],
        ],
    ],
];
