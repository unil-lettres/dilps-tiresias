<?php

declare(strict_types=1);

use Application\DBAL\Types\ExportFormatType;
use Application\DBAL\Types\ExportStatusType;
use Application\DBAL\Types\SiteType;

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
                'format' => ExportFormatType::ZIP,
                'cards' => [6005],
                'site' => SiteType::DILPS,
            ],
            'pptx' => [
                'format' => ExportFormatType::PPTX,
                'cards' => [6005],
                'site' => SiteType::DILPS,
            ],
            'csv' => [
                'format' => ExportFormatType::CSV,
                'cards' => [6005],
                'site' => SiteType::DILPS,
            ],
        ],
    ],
    [
        'data' => [
            'zip' => [
                'status' => ExportStatusType::DONE,
            ],
            'pptx' => [
                'status' => ExportStatusType::DONE,
            ],
            'csv' => [
                'status' => ExportStatusType::DONE,
            ],
        ],
    ],
];
