<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            updateFile(id: 13000, input: {card: 6003}) {
                card { id }
            }
        }',
    ],
    [
        'data' => [
            'updateFile' => [
                'card' => [
                    'id' => '6003',
                ],
            ],
        ],
    ],
    // junior (1002) owns both cards 6006 and 6003
    function (Connection $connection): void {
        $connection->executeStatement('UPDATE card SET owner_id = 1002 WHERE id = 6003');
        $connection->executeStatement('UPDATE file SET card_id = 6006 WHERE id = 13000');
    },
];
