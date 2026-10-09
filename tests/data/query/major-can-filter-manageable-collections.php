<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => '{
            collections(filter: {groups: [
                {conditions: [{id: {in: {values: [2000, 2001, 2002, 2008]}}}]}
                {conditions: [{custom: {manageableByViewer: {value: true}}}]}
            ]}) {
                items { id }
            }
        }',
    ],
    [
        'data' => [
            'collections' => [
                'items' => [
                    ['id' => '2001'],
                    ['id' => '2002'],
                    ['id' => '2008'],
                ],
            ],
        ],
    ],
    // major (1009) manages the non-private collections 2001 and 2002 without owning them, and the private 2008 as a
    // responsible, but not the private 2000 that they may only read
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_subscriber (collection_id, user_id) VALUES (2000, 1009)');
        $connection->executeStatement('INSERT INTO collection_responsible (collection_id, user_id) VALUES (2008, 1009)');
    },
];
