<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            exports {
                length
            }
        }',
    ],
    [
        'data' => [
            'exports' => [
                'length' => 0,
            ],
        ],
    ],
];
