<?php

declare(strict_types=1);

use Application\Model\User;

return [
    [
        'query' => '{
               newUser: userRolesAvailable(user: null)
        }',
    ],
    [
        'data' => [
            'newUser' => [
                User::ROLE_STUDENT,
            ],
        ],
    ],
];
