<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            unlinkCardCollection(card: 6001, collection: 2001) {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                // A readable message, that does not expose the internals of the API
                'message' => "Vous n'avez pas le droit de modifier le contenu de cette collection.",
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
                    'unlinkCardCollection',
                ],
            ],
        ],
    ],
];
