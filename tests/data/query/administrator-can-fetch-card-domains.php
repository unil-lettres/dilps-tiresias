<?php

declare(strict_types=1);

return [
    [
        'query' => 'query CardDomains($filter: CardFilter) {
            cardDomains(filter: $filter) {
                id
                name
            }
        }',
        'variables' => [
            'filter' => [
                'groups' => [
                    [
                        'conditions' => [
                            [
                                'site' => ['equal' => ['value' => 'Dilps']],
                                'filename' => ['equal' => ['value' => '', 'not' => true]],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    [
        'data' => [
            'cardDomains' => [
                [
                    'id' => '9001',
                    'name' => 'Test domain 9001',
                ],
                [
                    'id' => '9000',
                    'name' => 'Test domain 9000',
                ],
            ],
        ],
    ],
];
