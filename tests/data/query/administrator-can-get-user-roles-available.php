<?php

declare(strict_types=1);

use Application\Model\User;

$args = require 'junior-can-get-user-roles-available.php';

return [
    $args[0],
    [
        'data' => [
            'newUser' => [
                User::ROLE_STUDENT,
                User::ROLE_JUNIOR,
                User::ROLE_SENIOR,
                User::ROLE_MAJOR,
                User::ROLE_ADMINISTRATOR,
            ],
            'junior' => [
                User::ROLE_STUDENT,
                User::ROLE_JUNIOR,
                User::ROLE_SENIOR,
                User::ROLE_MAJOR,
                User::ROLE_ADMINISTRATOR,
            ],
            'administrator' => [
                User::ROLE_STUDENT,
                User::ROLE_JUNIOR,
                User::ROLE_SENIOR,
                User::ROLE_MAJOR,
                User::ROLE_ADMINISTRATOR,
            ],
        ],
    ],
];
