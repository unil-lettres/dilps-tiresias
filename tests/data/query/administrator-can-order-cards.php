<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            cards(sorting: [{field: id, order: ASC}]) {
                items {
                    id
                }
            }
        }',
    ],
    [
        'data' => [
            'cards' => [
                'items' => [
                    [
                        'id' => 6000,
                    ],
                    [
                        'id' => 6001,
                    ],
                    [
                        'id' => 6002,
                    ],
                    [
                        'id' => 6003,
                    ],
                    [
                        'id' => 6004,
                    ],
                    [
                        'id' => 6005,
                    ],
                    [
                        'id' => 6006,
                    ],
                    [
                        'id' => 6007,
                    ],
                    [
                        'id' => 6008,
                    ],
                    [
                        'id' => 6009,
                    ],
                    [
                        'id' => 6010,
                    ],
                    [
                        'id' => 6011,
                    ],
                    [
                        'id' => 6012,
                    ],
                    [
                        'id' => 6013,
                    ],
                ],
            ],
        ],
    ],
];
