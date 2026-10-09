<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            updateCard(id: 6000, input: {name: "updated by collection owner"}) {
                name
            }
        }',
    ],
    [
        'data' => [
            'updateCard' => [
                'name' => 'updated by collection owner',
            ],
        ],
    ],
    // senior (1001) owns collection 2002, made private, that contains the private card 6000 of student (1003). Contrary
    // to juniors, seniors get rights on the cards of any collection they own or are responsible of
    function (Connection $connection): void {
        $connection->executeStatement("UPDATE collection SET visibility = 'private', owner_id = 1001 WHERE id = 2002");
        $connection->executeStatement('INSERT IGNORE INTO card_collection (collection_id, card_id) VALUES (2002, 6000)');
    },
];
