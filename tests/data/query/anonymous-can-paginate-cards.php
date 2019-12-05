<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            cards(pagination: {pageIndex:0, pageSize: 2}) {
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
                'length' => 2,
                'pageIndex' => 0,
                'items' => [
                    [
                        'id' => 6005,
                    ],
                    [
                        'id' => 6012,
                    ],
                ],
            ],
        ],
    ],
];
