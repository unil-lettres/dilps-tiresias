<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            updateUser(id: 1003, input: {email: "someone-else@example.com"}) {
                email
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'Only administrators can change the email of a user',
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
