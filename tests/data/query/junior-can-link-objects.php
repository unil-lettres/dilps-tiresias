<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            linkCardCollection(collection: 2002, card: 6005) {
                id
                collections {
                    id
                }
            }

            linkCardCard(card1: 6006, card2: 6005) {
                id
                cards {
                    id
                    cards {
                        id
                    }
                }
            }
        }',
    ],
    [
        'data' => [
            'linkCardCollection' => [
                'id' => '6005',
                'collections' => [
                    [
                        'id' => '2002',
                    ],
                ],
            ],
            'linkCardCard' => [
                'id' => '6006',
                'cards' => [
                    [
                        'id' => '6005',
                        'cards' => [
                            [
                                'id' => '6006',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
];
