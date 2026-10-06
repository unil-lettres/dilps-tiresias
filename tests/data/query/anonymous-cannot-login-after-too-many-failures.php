<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            login(login: "administrator" password: "administrator") {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'Trop de tentatives de connexion ont échoué. Veuillez réessayer dans une demi-heure.',
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
                    'login',
                ],
            ],
        ],
    ],
    // The same IP failed to log in 21 times in the last 30 minutes, so even the right password is refused
    function (Connection $connection): void {
        for ($i = 0; $i < 21; ++$i) {
            $connection->executeStatement("INSERT INTO log (level, message, creation_date, ip) VALUES (200, 'login failed', NOW(), 'script')");
        }
    },
];
