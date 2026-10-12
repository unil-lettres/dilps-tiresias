<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            linkCollectionResponsible(collection: 2002, responsible: 1001) {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'User "student" with role student is not allowed on resource "Collection#2002" with privilege "manageResponsibles" because it is not the owner',
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
                    'linkCollectionResponsible',
                ],
            ],
        ],
    ],
    // student (1003) is only a responsible of collection 2002: managing responsibles is reserved to the owner
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_responsible (collection_id, user_id) VALUES (2002, 1003)');
    },
];
