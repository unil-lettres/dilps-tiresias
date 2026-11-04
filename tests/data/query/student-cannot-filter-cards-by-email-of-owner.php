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
                'message' => 'Only administrators can filter or sort on email',
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
