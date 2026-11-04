<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;
use PHPUnit\Framework\Assert;

return [
    [
        'query' => 'mutation {
            login(login: "administrator" password: "wrong") {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => "Le nom d'utilisateur ou mot de passe est incorrect",
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
    null,
    // The failure is recorded, to refuse further attempts from the same IP after too many failures
    function (Connection $connection): void {
        $count = $connection->fetchOne("SELECT COUNT(*) FROM log WHERE message = 'login failed' AND ip = 'script' AND creation_date > DATE_SUB(NOW(), INTERVAL 1 MINUTE)");
        Assert::assertSame(1, (int) $count);
    },
];
