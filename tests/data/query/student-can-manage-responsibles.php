<?php

declare(strict_types=1);

// student (1003) owns collection 2000, so may add/remove its responsibles
return [
    [
        'query' => 'mutation {
            linkCollectionResponsible(collection: 2000, responsible: 1001) {
                id
            }
        }',
    ],
    [
        'data' => [
            'linkCollectionResponsible' => [
                'id' => '2000',
            ],
        ],
    ],
];
