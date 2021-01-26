<?php

declare(strict_types=1);

use Application\Model\User;

return [
    [
        'query' => 'mutation ($inputUser: UserPartialInput!) {
            updateUser(id: 1000 input: $inputUser) {
                id
                login
                email
                type
            }
        }',
        'variables' => [
            'inputUser' => [
                'login' => 'testlogin',
                'email' => 'test@email.com',
                'type' => User::TYPE_DEFAULT,
                'role' => User::ROLE_ADMINISTRATOR,
            ],
        ],
    ],
    [
        'errors' => [
            [
                'message' => 'User "student" with role student is not allowed on resource "User#1000" with privilege "update" because it is not himself',
                'extensions' => [
                    'category' => 'Permissions',
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
