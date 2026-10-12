<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            unsubscribeCollection(collection: 2002) {
                id
            }
        }',
    ],
    [
        'data' => [
            'unsubscribeCollection' => [
                'id' => '2002',
            ],
        ],
    ],
    // student (1003) is a subscriber of collection 2002 and may leave it on their own
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_subscriber (collection_id, user_id) VALUES (2002, 1003)');
    },
    // afterwards the subscription must be gone
    function (Connection $connection): void {
        $count = $connection->fetchOne('SELECT COUNT(*) FROM collection_subscriber WHERE collection_id = 2002 AND user_id = 1003');
        PHPUnit\Framework\Assert::assertSame(0, (int) $count, 'subscriber should have been removed');
    },
];
