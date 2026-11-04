<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            extraStatistics(period: "all")
        }',
    ],
    [
        'errors' => [
            [
                'message' => 'User "student" with role student is not allowed on resource "Statistic#null" with privilege "read"',
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
                    'extraStatistics',
                ],
            ],
        ],
    ],
];
