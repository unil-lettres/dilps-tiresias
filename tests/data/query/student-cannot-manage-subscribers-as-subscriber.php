<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            linkCollectionSubscriber(collection: 2002, subscriber: 1001) {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'User "student" with role student is not allowed on resource "Collection#2002" with privilege "manageSubscribers" because it is not the owner, nor one of the responsible',
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
                    'linkCollectionSubscriber',
                ],
            ],
        ],
    ],
    // student (1003) is only a subscriber (read-only) of collection 2002
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_subscriber (collection_id, user_id) VALUES (2002, 1003)');
    },
];
