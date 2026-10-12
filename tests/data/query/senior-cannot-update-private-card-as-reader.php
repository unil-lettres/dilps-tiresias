<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            updateCard(id: 6000, input: {name: "updated by reader"}) {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'User "senior" with role senior is not allowed on resource "Card#6000" with privilege "update" because:

- it is not the owner, nor one of the responsible
- it is not the owner, nor one of the responsible of a collection with visibility member or administrator',
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
                    'updateCard',
                ],
            ],
        ],
    ],
    // senior (1001) is a reader of collection 2002, that contains the private card 6000 of student (1003): read-only
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_subscriber (collection_id, user_id) VALUES (2002, 1001)');
        $connection->executeStatement('INSERT IGNORE INTO card_collection (collection_id, card_id) VALUES (2002, 6000)');
    },
];
