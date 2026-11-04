<?php

declare(strict_types=1);

use Application\Model\User;
use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            updateUser(id: 1003, input: {password: "local-password"}) {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'Un compte AAI se connecte par son institution, il ne peut pas avoir de mot de passe.',
                'extensions' => [
                    'showSnack' => true,
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
    // student (1003) logs in through AAI, so a password of their own would bypass their institution
    function (Connection $connection): void {
        $connection->executeStatement("UPDATE user SET type = 'aai' WHERE id = 1003");

        // The current user is already loaded, so it must see the change too
        _em()->refresh(User::getCurrent());
    },
];
