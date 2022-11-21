<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            one_artist: cards(filter: {groups: [{conditions: [{custom: {search: {value: "3000"}}}]}]}) {
                items { id }
            }
            two_artists: cards(filter: {groups: [{conditions: [{custom: {search: {value: "3000 3001"}}}]}]}) {
                items { id }
            }
            two_artists_and_card: cards(filter: {groups: [{conditions: [{custom: {search: {value: "3000 3001 6000"}}}]}]}) {
                items { id }
            }
        }',
    ],
    [
        'data' => [
            'one_artist' => [
                'items' => [
                    [
                        'id' => '6000',
                    ],
                    [
                        'id' => '6001',
                    ],
                ],
            ],
            'two_artists' => [
                'items' => [
                    [
                        'id' => '6000',
                    ],
                ],
            ],
            'two_artists_and_card' => [
                'items' => [
                    [
                        'id' => '6000',
                    ],
                ],
            ],
        ],
    ],

];
