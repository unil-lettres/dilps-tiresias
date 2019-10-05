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
            }
        }',
        'variables' => [
            'inputUser' => [
                'login' => 'testlogin',
                'email' => 'test@email.com',
                'type' => User::TYPE_DEFAULT,
                'role' => User::ROLE_STUDENT,
            ],
        ],
    ],
    [
        'data' => [
            'updateUser' => [
                'id' => 1003,
                'login' => 'testlogin',
                'email' => 'test@email.com',
                'type' => User::TYPE_DEFAULT,
            ],
        ],
    ],
];
