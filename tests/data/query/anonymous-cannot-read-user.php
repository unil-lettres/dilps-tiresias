<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            user(id: "1000") {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'Entity not found for class `Application\Model\User` and ID `1000`.',
                'extensions' => [
                    'category' => 'user',
                ],
                'locations' => [
                    [
                        'line' => 2,
                        'column' => 13,
                    ],
                ],
                'path' => [
                    'user',
                ],

            ],
        ],
    ],
];
