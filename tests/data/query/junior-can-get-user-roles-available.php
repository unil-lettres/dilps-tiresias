<?php

declare(strict_types=1);

use Application\Model\User;

return [

    [
        'query' => '{
               newUser: userRolesAvailable(user: null)
               junior: userRolesAvailable(user: 1002)
               administrator: userRolesAvailable(user: 1000)
        }',
    ],
    [
        'data' => [
            'newUser' => [
                User::ROLE_STUDENT,
                User::ROLE_JUNIOR,
            ],
            'junior' => [
                User::ROLE_STUDENT,
                User::ROLE_JUNIOR,
            ],
            'administrator' => [
                User::ROLE_ADMINISTRATOR,
            ],
        ],
    ],
];
