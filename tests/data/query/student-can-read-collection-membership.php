<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => '{
            collection(id: 2002) {
                responsiblesCount
                subscribersCount
                viewerIsResponsible
                viewerIsSubscriber
                canManageContent
                canManageSubscribers
                canManageResponsibles
            }
        }',
    ],
    [
        'data' => [
            'collection' => [
                'responsiblesCount' => 1,
                'subscribersCount' => 2,
                'viewerIsResponsible' => true,
                'viewerIsSubscriber' => false,
                'canManageContent' => true,
                'canManageSubscribers' => true,
                'canManageResponsibles' => false,
            ],
        ],
    ],
    // student (1003) is a responsible of collection 2002 (owned by junior 1002), that has two readers
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_responsible (collection_id, user_id) VALUES (2002, 1003)');
        $connection->executeStatement('INSERT INTO collection_subscriber (collection_id, user_id) VALUES (2002, 1000), (2002, 1001)');
    },
];
