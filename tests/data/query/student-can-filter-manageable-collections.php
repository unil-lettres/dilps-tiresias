<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        // Like the hierarchic selector, that adds its own group before ours
        'query' => '{
            collections(filter: {groups: [
                {conditions: [{id: {in: {values: [2000, 2001, 2002, 2006]}}}]}
                {conditions: [{parent: {empty: {}}}]}
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
                    ['id' => '2000'],
                    ['id' => '2002'],
                ],
            ],
        ],
    ],
    // student (1003) owns 2000 and its child 2006, and is a responsible of 2002, but not of 2001
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_responsible (collection_id, user_id) VALUES (2002, 1003)');
    },
];
