<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            updateCard(id: 6006, input: {visibility: Member}) {
                visibility
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => "Seul·e·s les administrateur·rice·s peuvent modifier la visibilité d'une fiche.",
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
                    'updateCard',
                ],
            ],
        ],
    ],
    // junior (1002) can update their card 6006, but not show it to all members, because administrators validate cards first
    function (Connection $connection): void {
        $connection->executeStatement("UPDATE card SET visibility = 'private' WHERE id = 6006");
    },
];
