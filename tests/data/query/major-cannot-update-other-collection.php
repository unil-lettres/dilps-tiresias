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
                'message' => 'User "major" with role major is not allowed on resource "Collection#2001" with privilege "update" because it is not the owner, nor one of the responsible',
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
