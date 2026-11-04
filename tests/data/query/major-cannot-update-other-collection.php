<?php

declare(strict_types=1);

return [
    [
        'query' => ' mutation UpdateCollection($id: CollectionID!, $input: CollectionPartialInput!) {
            updateCollection(id: $id, input: $input) {
                name
            }
        }',
        'variables' => [
            'id' => 2001,
            'input' => [
                'name' => 'updated name',
            ],
        ],
    ],
    [
        'errors' => [
            [
                'message' => "Vous n'avez pas le droit de modifier cette collection.",
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
                    'updateCollection',
                ],
            ],
        ],
    ],
];
