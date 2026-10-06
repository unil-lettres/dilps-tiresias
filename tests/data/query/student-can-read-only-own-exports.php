<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => '{
            exports {
                items {
                    id
                    filename
                }
            }
        }',
    ],
    [
        'data' => [
            'exports' => [
                'items' => [
                    [
                        'id' => '14000',
                        'filename' => 'dilps-14000-0123456789.zip',
                    ],
                ],
            ],
        ],
    ],
    // student (1003) created export 14000, and junior (1002) created export 14001 that may contain their private cards
    function (Connection $connection): void {
        $connection->executeStatement("UPDATE export SET owner_id = 1003, creator_id = 1003, filename = 'dilps-14000-0123456789.zip' WHERE id = 14000");
        $connection->executeStatement("UPDATE export SET owner_id = 1002, creator_id = 1002, filename = 'dilps-14001-0123456789.zip' WHERE id = 14001");
    },
];
