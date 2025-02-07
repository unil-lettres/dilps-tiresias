<?php

declare(strict_types=1);

return [
    [
        'query' => 'mutation CreateExport($zip: CreateExportInput!, $pptx: CreateExportInput!, $csv: CreateExportInput!) {
            zip: createExport(input: $zip) {
                status
            }
            pptx: createExport(input: $pptx) {
                status
            }
            csv: createExport(input: $csv) {
                status
            }
        }',
        'variables' => [
            'zip' => [
                'format' => Application\Enum\ExportFormat::Zip,
                'cards' => [6005],
                'site' => Application\Enum\Site::Dilps,
            ],
            'pptx' => [
                'format' => Application\Enum\ExportFormat::Pptx,
                'cards' => [6005],
                'site' => Application\Enum\Site::Dilps,
            ],
            'csv' => [
                'format' => Application\Enum\ExportFormat::Csv,
                'cards' => [6005],
                'site' => Application\Enum\Site::Dilps,
            ],
        ],
    ],
    [
        'data' => [
            'zip' => [
                'status' => 'Done',
            ],
            'pptx' => [
                'status' => 'Done',
            ],
            'csv' => [
                'status' => 'Done',
            ],
        ],
    ],
];
