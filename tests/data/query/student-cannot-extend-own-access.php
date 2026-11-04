<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            updateUser(id: 1003, input: {activeUntil: "2099-01-01T00:00:00+01:00"}) {
                activeUntil
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'Only administrators can change the activeUntil of a user',
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
                    'updateUser',
                ],
            ],
        ],
    ],
];
