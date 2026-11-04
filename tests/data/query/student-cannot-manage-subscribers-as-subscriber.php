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
                'message' => "Vous n'avez pas le droit de gérer les lecteur·rice·s de cette collection.",
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
