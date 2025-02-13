<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            suggestCreation(id: 6003, request: "test request") {
                type
                request
                original {
                    id
                }
                suggestion {
                    id
                }
            }

            suggestUpdate(id: 6004, request: "test request") {
                type
                request
                original {
                    id
                }
                suggestion {
                    id
                }
            }

            suggestDeletion(id: 6004, request: "test request") {
                type
                request
                original {
                    id
                }
                suggestion {
                    id
                }
            }
        }',
    ],
    [
        'data' => [
            'suggestCreation' => [
                'type' => 'Create',
                'request' => 'test request',
                'original' => null,
                'suggestion' => [
                    'id' => '6003',
                ],
            ],
            'suggestUpdate' => [
                'type' => 'Update',
                'request' => 'test request',
                'original' => [
                    'id' => '6000',
                ],
                'suggestion' => [
                    'id' => '6004',
                ],
            ],
            'suggestDeletion' => [
                'type' => 'Delete',
                'request' => 'test request',
                'original' => [
                    'id' => '6004',
                ],
                'suggestion' => null,
            ],
        ],
    ],
];
