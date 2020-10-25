<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation {
            linkCardCollection(collection: 2002, card: 6005) {
                id
                updater {
                    id
                }
                collections {
                    id
                    updater {
                        id
                    }
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
                'updater' => null,
                'collections' => [
                    [
                        'id' => '2002',
                        'updater' => null,
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
