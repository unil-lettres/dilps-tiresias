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
                'message' => 'Non-logged user with role anonymous is not allowed on resource "Export#null" with privilege "create"',
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
