<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            antiqueName_tiresias: antiqueName(id: 12000) { id }
            artist_dilps: artist(id: 3000) { id }
            card_dilps: card(id: 6005) { id }
            card_tiresias: card(id: 6012) { id }
            change_dilps: change(id: 7000) { id }
            documentType_tiresias: documentType(id: 11000) { id }
            domain_tiresias: domain(id: 9000) { id }
            institution_dilps: institution(id: 5000) { id }
            institution_tiresias: institution(id: 5001) { id }
            material_tiresias: material(id: 8000) { id }
            news_dilps: news(id: 10002) { id }
            news_tiresias: news(id: 10000) { id }
            period_tiresias: period(id: 7000) { id }
            tag_dilps: tag(id: 4000) { id }
            tag_tiresias: tag(id: 4002) { id }
            user_dilps: user(id: 1003) { id }
            user_tiresias: user(id: 1007) { id }
        }',
    ], [
        'data' => [
            'antiqueName_tiresias' => ['id' => 12000],
            'artist_dilps' => ['id' => 3000],
            'card_dilps' => ['id' => 6005],
            'card_tiresias' => ['id' => 6012],
            'change_dilps' => ['id' => 7000],
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
    ],
];
