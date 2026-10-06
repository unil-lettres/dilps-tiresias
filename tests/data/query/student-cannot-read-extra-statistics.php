<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            extraStatistics(period: "all")
        }',
    ],
    [
        'errors' => [
            [
                'message' => "Vous n'avez pas accès à ces statistiques.",
                'extensions' => [
                    'showSnack' => true,
                ],
                'locations' => [
                    [
                        'line' => 2,
                        'column' => 13,
                    ],
                ],
                'path' => [
                    'extraStatistics',
                ],
            ],
        ],
    ],
];
