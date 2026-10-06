<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            other: user(id: 1003) { email }
            searchByEmail: users(filter: {groups: [{conditions: [{custom: {search: {value: "student-dilps@example.com"}}}]}]}) {
                items { id }
            }
        }',
    ],
    [
        'data' => [
            'other' => [
                'email' => 'student-dilps@example.com',
            ],
            'searchByEmail' => [
                'items' => [
                    [
                        'id' => '1003',
                    ],
                ],
            ],
        ],
    ],
];
