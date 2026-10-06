<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            createCollection(input: {name: "sub-collection", visibility: Member, site: Dilps, parent: 2002}) {
                name
                parent {
                    id
                }
            }
        }',
    ],
    [
        'data' => [
            'createCollection' => [
                'name' => 'sub-collection',
                'parent' => [
                    'id' => '2002',
                ],
            ],
        ],
    ],
    // student (1003) is a responsible of collection 2002 (owned by junior 1002), so may add a sub-collection to it
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_responsible (collection_id, user_id) VALUES (2002, 1003)');
    },
];
