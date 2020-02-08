<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            cards(pagination: {pageIndex:1, pageSize: 2}) {
                length
                pageIndex
                items {
                    id
                }
            }
        }',
    ],
    [
        'data' => [
            'cards' => [
                'length' => 14,
                'pageIndex' => 1,
                'items' => [
                    [
                        'id' => 6004,
                    ],
                    [
                        'id' => 6007,
                    ],
                ],
            ],
        ],
    ],
];
