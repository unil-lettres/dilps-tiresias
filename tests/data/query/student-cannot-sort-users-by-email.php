<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            users(sorting: [{field: email, order: ASC}]) { length }
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
                    'users',
                ],
            ],
        ],
    ],
];
