<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => '{
            collection(id: 2000) {
                id
                viewerIsSubscriber
            }
        }',
    ],
    [
        'data' => [
            'collection' => [
                'id' => '2000',
                'viewerIsSubscriber' => true,
            ],
        ],
    ],
    // administrator (1000) is a reader of the private collection 2000 of student (1003), like any other reader
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_subscriber (collection_id, user_id) VALUES (2000, 1000)');
    },
];
