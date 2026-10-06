<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            other: user(id: 1003) { email }
            searchByEmail: users(filter: {groups: [{conditions: [{custom: {search: {value: "student-dilps@example.com"}}}]}]}) {
                items { id }
            }
            filterByEmail: users(filter: {groups: [{conditions: [{email: {equal: {value: "student-dilps@example.com"}}}]}]}, sorting: [{field: email, order: ASC}]) {
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
            'filterByEmail' => [
                'items' => [
                    [
                        'id' => '1003',
                    ],
                ],
            ],
        ],
    ],
];
