<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            linkCollectionResponsible(collection: 2002, responsible: 1001) {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => "Vous n'avez pas le droit de gérer les responsables de cette collection.",
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
                    'linkCollectionResponsible',
                ],
            ],
        ],
    ],
    // student (1003) is only a responsible of collection 2002: managing responsibles is reserved to the owner
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_responsible (collection_id, user_id) VALUES (2002, 1003)');
    },
];
