<?php

declare(strict_types=1);

use Application\Model\User;

return [
    [
        'query' => 'mutation ($inputUser: UserPartialInput!) {
            updateUser(id: 1003 input: $inputUser) {
                id
                login
                email
                type
                activeUntil
                name
            }
        }',
        'variables' => [
            'inputUser' => [
                // The client sends the whole profile, so administrative fields are accepted as long as they are unchanged
                'login' => 'student',
                'email' => 'student-dilps@example.com',
                'activeUntil' => null,
                'role' => User::ROLE_STUDENT,
                'name' => 'new name',
            ],
        ],
    ],
    [
        'data' => [
            'updateUser' => [
                'id' => 1003,
                'login' => 'student',
                'email' => 'student-dilps@example.com',
                'type' => 'Default',
                'activeUntil' => null,
                'name' => 'new name',
            ],
        ],
    ],
];
