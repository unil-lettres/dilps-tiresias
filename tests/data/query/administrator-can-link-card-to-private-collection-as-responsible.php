<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            linkCardCollection(card: 6005, collection: 2000) {
                id
            }
        }',
    ],
    [
        'data' => [
            'linkCardCollection' => [
                'id' => '6005',
            ],
        ],
    ],
    // administrator (1000) is a responsible of the private collection 2000 of student (1003), so may curate its images
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_responsible (collection_id, user_id) VALUES (2000, 1000)');
    },
];
