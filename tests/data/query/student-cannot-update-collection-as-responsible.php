<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => ' mutation UpdateCollection($id: CollectionID!, $input: CollectionPartialInput!) {
            updateCollection(id: $id, input: $input) {
                name
            }
        }',
        'variables' => [
            'id' => 2002,
            'input' => [
                'name' => 'updated name',
            ],
        ],
    ],
    [
        'errors' => [
            [
                'message' => "Vous n'avez pas le droit de modifier cette collection.",
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
                    'updateCollection',
                ],
            ],
        ],
    ],
    // student (1003) is only a responsible of collection 2002 (owned by junior 1002)
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_responsible (collection_id, user_id) VALUES (2002, 1003)');
    },
];
