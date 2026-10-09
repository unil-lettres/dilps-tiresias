<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => '{
            collections(filter: {groups: [{conditions: [{id: {in: {values: [2000, 2001, 2002, 2008]}}}]}]}) {
                items {
                    id
                    canManageContent
                }
            }
        }',
    ],
    [
        'data' => [
            'collections' => [
                'items' => [
                    [
                        'id' => '2000',
                        'canManageContent' => false,
                    ],
                    [
                        'id' => '2001',
                        'canManageContent' => true,
                    ],
                    [
                        'id' => '2002',
                        'canManageContent' => true,
                    ],
                    [
                        'id' => '2008',
                        'canManageContent' => true,
                    ],
                ],
            ],
        ],
    ],
    // Like administrators, major (1009) may add images to the collections visible to members (2001) or to administrators
    // (2002), even as a mere reader. But in private collections, only as a responsible (2008), not as a reader (2000).
    function (Connection $connection): void {
        $connection->executeStatement("UPDATE collection SET visibility = 'administrator' WHERE id = 2002");
        $connection->executeStatement('INSERT INTO collection_subscriber (collection_id, user_id) VALUES (2000, 1009), (2002, 1009)');
        $connection->executeStatement('INSERT INTO collection_responsible (collection_id, user_id) VALUES (2008, 1009)');
    },
];
