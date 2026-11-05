<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            updateUser(id: 1003, input: {termsAgreement: "2026-01-01T00:00:00+01:00"}) {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => "La licence ne peut être acceptée que par l'utilisateur·rice concerné·e, et ne peut pas être retirée.",
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
                    'updateUser',
                ],
            ],
        ],
    ],
    // student (1003) did not agree yet, and only they can do it
    function (Connection $connection): void {
        $connection->executeStatement('UPDATE user SET terms_agreement = NULL WHERE id = 1003');
    },
];
