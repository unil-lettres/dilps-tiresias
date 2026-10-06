<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            updateCard(id: 6000, input: {name: "updated by collection owner"}) {
                id
                name
            }
        }',
    ],
    [
        'data' => [
            'updateCard' => [
                'id' => '6000',
                'name' => 'updated by collection owner',
            ],
        ],
    ],
    // junior (1002) owns collection 2002, that contains the private card 6000 of student (1003). The owner of a collection
    // has the same rights as its responsibles on its cards, so they can see and update it.
    function (Connection $connection): void {
        $connection->executeStatement('INSERT IGNORE INTO card_collection (collection_id, card_id) VALUES (2002, 6000)');
    },
];
