<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation CreateExport($zip: CreateExportInput!) {
            createExport(input: $zip) {
                status
            }
        }',
        'variables' => [
            'zip' => [
                'format' => Application\Enum\ExportFormat::Zip,
                'cards' => [6005],
                'site' => Application\Enum\Site::Dilps,
            ],
        ],
    ],
    [
        'errors' => [
            [
                'message' => "Vous n'avez pas le droit de créer un export.",
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
                    'createExport',
                ],
            ],
        ],
    ],
];
