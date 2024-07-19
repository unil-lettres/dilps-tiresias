<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            updateCard(id: 6000, input: {antiqueNames: ["1","2", "3"]}) {
                id
                antiqueNames {
                    id
                }
            }
        }',
    ],
    [
        'data' => [
            'updateCard' => [
                'id' => '6000',
                'antiqueNames' => [],
            ],
        ],
    ],
];
