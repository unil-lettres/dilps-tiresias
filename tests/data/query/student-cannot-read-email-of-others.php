<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            himself: user(id: 1003) { email }
            other: user(id: 1002) { email }
            searchByEmail: users(filter: {groups: [{conditions: [{custom: {search: {value: "junior-dilps@example.com"}}}]}]}) {
                length
            }
        }',
    ],
    [
        'data' => [
            'himself' => [
                'email' => 'student-dilps@example.com',
            ],
            'other' => [
                'email' => null,
            ],
            'searchByEmail' => [
                'length' => 0,
            ],
        ],
    ],
];
