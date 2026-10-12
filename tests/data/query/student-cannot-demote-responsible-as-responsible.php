<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            linkCollectionSubscriber(collection: 2002, subscriber: 1001) {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => "Cet utilisateur est déjà responsable de la collection. Pour en faire un lecteur, retirez-le d'abord des responsables.",
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
                    'linkCollectionSubscriber',
                ],
            ],
        ],
    ],
    // student (1003) and senior (1001) are both responsibles of collection 2002 (owned by junior 1002)
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_responsible (collection_id, user_id) VALUES (2002, 1003), (2002, 1001)');
    },
    // student may add subscribers, but not demote another responsible to subscriber, which only the owner may do
    function (Connection $connection): void {
        $count = $connection->fetchOne('SELECT COUNT(*) FROM collection_responsible WHERE collection_id = 2002 AND user_id = 1001');
        PHPUnit\Framework\Assert::assertSame(1, (int) $count, 'senior should still be a responsible');
    },
];
