<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            updateFile(id: 13000, input: {card: 6006}) {
                card { id }
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'User "student" with role student is not allowed on resource "Card#6006" with privilege "update"',
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
                    'updateFile',
                ],
            ],
        ],
    ],
    // student (1003) can update their suggestion 6000 and its file 13000, but not the card 6006 of junior (1002)
    function (Connection $connection): void {
        $connection->executeStatement("INSERT INTO `change` (type, suggestion_id, request, site, owner_id, creator_id) VALUES ('create', 6000, '', 'dilps', 1003, 1003)");
    },
];
