<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            users(pagination: {offset: -1, pageIndex: -1, pageSize: -1}) {
                    length
                    pageSize
                    pageIndex
                }
            }',
    ],
    [
        'data' => [
            'users' => [
                'length' => 0,
                'pageSize' => -1,
                'pageIndex' => -1,
            ],
        ],

    ],
];
