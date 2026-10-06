<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            updateUser(id: 1003, input: {login: "student-renamed", email: "student-renamed@example.com", activeUntil: null}) {
                login
                email
                activeUntil
            }
        }',
    ],
    [
        'data' => [
            'updateUser' => [
                'login' => 'student-renamed',
                'email' => 'student-renamed@example.com',
                'activeUntil' => null,
            ],
        ],
    ],
    function (Connection $connection): void {
        $connection->executeStatement("UPDATE user SET active_until = '2030-01-01 00:00:00' WHERE id = 1003");
    },
];
