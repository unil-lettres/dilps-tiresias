<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            cards(sorting: [{field: artists, order: ASC}]) {
                items {
                    id
                    artists {
                        name
                    }
                }
            }
        }',
    ],
    [
        'data' => [
            'cards' => [
                'items' => [
                    [
                        'id' => '6001',
                        'artists' => [],
                    ],
                    [
                        'id' => '6002',
                        'artists' => [],
                    ],
                    [
                        'id' => '6003',
                        'artists' => [],
                    ],
                    [
                        'id' => '6004',
                        'artists' => [],
                    ],
                    [
                        'id' => '6005',
                        'artists' => [],
                    ],
                    [
                        'id' => '6006',
                        'artists' => [],
                    ],
                    [
                        'id' => '6007',
                        'artists' => [],
                    ],
                    [
                        'id' => '6008',
                        'artists' => [],
                    ],
                    [
                        'id' => '6009',
                        'artists' => [],
                    ],
                    [
                        'id' => '6010',
                        'artists' => [],
                    ],
                    [
                        'id' => '6011',
                        'artists' => [],
                    ],
                    [
                        'id' => '6012',
                        'artists' => [],
                    ],
                    [
                        'id' => '6013',
                        'artists' => [],
                    ],
                    [
                        'id' => '6000',
                        'artists' => [
                            [
                                'name' => 'Test artist 3000',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
];
