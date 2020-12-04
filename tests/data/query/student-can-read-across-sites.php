<?php

declare(strict_types=1);

$args = require 'anonymous-can-read-across-sites.php';

return [
    $args[0],
    [
        'data' => [
            'antiqueName_tiresias' => ['id' => 12000],
            'artist_dilps' => ['id' => 3000],
            'card_dilps' => ['id' => 6005],
            'card_tiresias' => ['id' => 6012],
            'change_dilps' => null,
            'change_tiresias' => null,
            'collection_dilps' => ['id' => 2000],
            'collection_tiresias' => null,
            'documentType_tiresias' => ['id' => 11000],
            'domain_tiresias' => ['id' => 9000],
            'institution_dilps' => ['id' => 5000],
            'institution_tiresias' => ['id' => 5001],
            'material_tiresias' => ['id' => 8000],
            'news_dilps' => ['id' => 10002],
            'news_tiresias' => ['id' => 10000],
            'period_tiresias' => ['id' => 7000],
            'tag_dilps' => ['id' => 4000],
            'tag_tiresias' => ['id' => 4002],
            'user_dilps' => ['id' => 1003],
            'user_tiresias' => ['id' => 1007],
        ],
        'errors' => [
            [
                'message' => 'Entity not found for class `Application\\Model\\Change` and ID `7000`.',
                'extensions' => [
                    'category' => 'graphql',
                ],
                'locations' => [
                    [
                        'line' => 6,
                        'column' => 13,
                    ],
                ],
                'path' => [
                    'change_dilps',
                ],
            ],
            [
                'message' => 'Entity not found for class `Application\\Model\\Change` and ID `7003`.',
                'extensions' => [
                    'category' => 'graphql',
                ],
                'locations' => [
                    [
                        'line' => 7,
                        'column' => 13,
                    ],
                ],
                'path' => [
                    'change_tiresias',
                ],
            ],
            [
                'message' => 'Entity not found for class `Application\\Model\\Collection` and ID `2003`.',
                'extensions' => [
                    'category' => 'graphql',
                ],
                'locations' => [
                    [
                        'line' => 9,
                        'column' => 13,
                    ],
                ],
                'path' => [
                    'collection_tiresias',
                ],
            ],
        ],
    ],
];
