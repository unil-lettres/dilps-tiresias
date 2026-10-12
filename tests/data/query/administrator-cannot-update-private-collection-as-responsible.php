<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            updateCollection(id: 2000, input: {name: "updated by responsible"}) {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'User "administrator" with role administrator is not allowed on resource "Collection#2000" with privilege "update" because it is not the owner',
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
                    'updateCollection',
                ],
            ],
        ],
    ],
    // administrator (1000) is only a responsible of the private collection 2000 of student (1003): settings stay reserved to the owner
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_responsible (collection_id, user_id) VALUES (2000, 1000)');
    },
];
