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
        'data' => [
            'linkCollectionSubscriber' => [
                'id' => '2002',
            ],
        ],
    ],
    // student (1003) is a responsible of collection 2002 (owned by junior 1002)
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_responsible (collection_id, user_id) VALUES (2002, 1003)');
    },
];
