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
    // junior (1002) owns collection 2002, made private, that contains the private card 6000 of student (1003). Otherwise
    // any junior could take over any card they see, by adding it to a private collection of their own
    function (Connection $connection): void {
        $connection->executeStatement("UPDATE collection SET visibility = 'private' WHERE id = 2002");
        $connection->executeStatement('INSERT IGNORE INTO card_collection (collection_id, card_id) VALUES (2002, 6000)');
    },
];
