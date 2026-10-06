<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;
use PHPUnit\Framework\Assert;

return [
    [
        'query' => 'mutation {
            createTag(input: {name: "  Trimmed tag  ", site: Dilps}) { name }
            updateCard(id: 6005, input: {name: " Trimmed card ", expandedName: " Trimmed ", artists: ["  ", " Test artist 3000 "]}) {
                name
                expandedName
                artists { name }
            }
            updateUser(id: 1003, input: {password: " secret "}) { id }
        }',
    ],
    [
        'data' => [
            'createTag' => [
                'name' => 'Trimmed tag',
            ],
            'updateCard' => [
                'name' => 'Trimmed card',
                'expandedName' => 'Trimmed',
                'artists' => [
                    ['name' => 'Test artist 3000'],
                ],
            ],
            'updateUser' => [
                'id' => '1003',
            ],
        ],
    ],
    null,
    // The spaces of a password might be intentional, so it is never trimmed
    function (Connection $connection): void {
        $hash = $connection->fetchOne('SELECT password FROM user WHERE id = 1003');
        Assert::assertTrue(password_verify(' secret ', $hash));
    },
];
