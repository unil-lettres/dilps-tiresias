<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            unlinkCardCollection(collection: 2000, card: 6000) {
                id
                collections {
                    id
                }
            }
        }',
    ],
    [
        'data' => [
            'unlinkCardCollection' => [
                'id' => '6000',
                'collections' => [],
            ],
        ],
    ],
];
