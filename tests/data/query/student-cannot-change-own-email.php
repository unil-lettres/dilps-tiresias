<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            updateUser(id: 1003, input: {email: "someone-else@example.com"}) {
                email
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => "Seul·e·s les administrateur·rice·s peuvent modifier l'email d'un·e utilisateur·rice.",
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
];
