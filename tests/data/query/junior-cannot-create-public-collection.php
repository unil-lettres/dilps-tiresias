<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            createCollection(input: {name: "public collection", site: Dilps, visibility: Member}) {
                visibility
            }
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'Seul·e·s les seniors, les majors et les administrateur·rice·s peuvent rendre une collection visible par les membres.',
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
];
