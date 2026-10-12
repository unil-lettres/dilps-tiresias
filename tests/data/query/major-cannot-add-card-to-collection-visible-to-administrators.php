<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            linkCardCollection(card: 6005, collection: 2000) {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'Entity not found for class `Application\Model\Collection` and ID `2000`.',
                'extensions' => [
                    'objectNotFound' => true,
                ],
                'locations' => [
                    [
                        'line' => 2,
                        'column' => 13,
                    ],
                ],
                'path' => [
                    'linkCardCollection',
                ],
            ],
        ],
    ],
    // student (1003) made their collection 2000 visible to administrators, which majors cannot see
    function (Connection $connection): void {
        $connection->executeStatement("UPDATE collection SET visibility = 'administrator' WHERE id = 2000");
    },
];
