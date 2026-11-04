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
        'errors' => [
            [
                'message' => "Vous n'avez pas le droit de modifier cette fiche.",
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
    // junior (1002) owns collection 2002, made visible to administrators, that contains the private card 6000 of student
    // (1003). Only public collections give rights to juniors
    function (Connection $connection): void {
        $connection->executeStatement("UPDATE collection SET visibility = 'administrator' WHERE id = 2002");
        $connection->executeStatement('INSERT IGNORE INTO card_collection (collection_id, card_id) VALUES (2002, 6000)');
    },
];
