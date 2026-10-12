<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            updateCollection(id: 2000, input: {visibility: Member}) {
                visibility
            }
        }',
    ],
    [
        'data' => [
            'updateCollection' => [
                'visibility' => 'Member',
            ],
        ],
    ],
    // student (1003) made their collection 2000 visible to administrators, so that one of them makes it public
    function (Connection $connection): void {
        $connection->executeStatement("UPDATE collection SET visibility = 'administrator' WHERE id = 2000");
    },
];
