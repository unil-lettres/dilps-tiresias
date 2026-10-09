<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => '{
            own: collection(id: 2001) {
                permissions {
                    delete
                }
            }
            other: collection(id: 2002) {
                permissions {
                    delete
                }
            }
        }',
    ],
    [
        'data' => [
            'own' => [
                'permissions' => [
                    'delete' => true,
                ],
            ],
            'other' => [
                'permissions' => [
                    'delete' => false,
                ],
            ],
        ],
    ],
    // major (1009) owns collection 2001, but not 2002 (owned by junior 1002)
    function (Connection $connection): void {
        $connection->executeStatement('UPDATE collection SET owner_id = 1009 WHERE id = 2001');
    },
];
