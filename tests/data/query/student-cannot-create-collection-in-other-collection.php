<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            createCollection(input: {name: "sub-collection", visibility: Member, site: Dilps, parent: 2002}) {
                id
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'User "student" with role student is not allowed on resource "Collection#2002" with privilege "linkCard" because it is not the owner, nor one of the responsible',
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
                    'createCollection',
                ],
            ],
        ],
    ],
    // student (1003) has no right on collection 2002 (owned by junior 1002), so cannot add a sub-collection to it
];
