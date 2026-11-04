<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            deleteCards(ids: [6006])
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'User "junior" with role junior is not allowed on resource "Card#6006" with privilege "delete"',
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
                    'deleteCards',
                ],
            ],
        ],
    ],
    // junior (1002) can update their card 6006, but not delete it, because they submitted it as a suggestion
    function (Connection $connection): void {
        $connection->executeStatement("INSERT INTO `change` (type, suggestion_id, request, site, owner_id, creator_id) VALUES ('create', 6006, '', 'dilps', 1002, 1002)");
    },
];
