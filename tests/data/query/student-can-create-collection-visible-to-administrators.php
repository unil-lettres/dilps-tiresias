<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            createCollection(input: {name: "collection to validate", site: Dilps, visibility: Administrator}) {
                visibility
            }
        }',
    ],
    [
        'data' => [
            'createCollection' => [
                'visibility' => 'Administrator',
            ],
        ],
    ],
];
