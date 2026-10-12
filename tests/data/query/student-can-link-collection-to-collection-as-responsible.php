<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            linkCollectionToCollection(sourceCollection: 2001, targetCollection: 2002) {
                id
            }
        }',
    ],
    [
        'data' => [
            'linkCollectionToCollection' => [
                'id' => '2002',
            ],
        ],
    ],
    // student (1003) is only a responsible of collection 2002 (owned by junior 1002), which is enough to add images to it
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_responsible (collection_id, user_id) VALUES (2002, 1003)');
    },
];
