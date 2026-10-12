<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => '{
            card(id: 6000) {
                id
            }
        }',
    ],
    [
        'data' => [
            'card' => [
                'id' => '6000',
            ],
        ],
    ],
    // senior (1001) is a reader of collection 2002, that contains the private card 6000 of student (1003)
    function (Connection $connection): void {
        $connection->executeStatement('INSERT INTO collection_subscriber (collection_id, user_id) VALUES (2002, 1001)');
        $connection->executeStatement('INSERT IGNORE INTO card_collection (collection_id, card_id) VALUES (2002, 6000)');
    },
];
