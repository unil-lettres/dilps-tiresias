<?php

declare(strict_types=1);

use Application\DBAL\Types\ExportFormatType;
use Application\DBAL\Types\ExportStatusType;
use Application\DBAL\Types\SiteType;

return [
    [
        'query' => 'mutation CreateExport($zip: CreateExportInput!, $pptx: CreateExportInput!, $xlsx: CreateExportInput!) {
            zip: createExport(input: $zip) {
                status
            }
            pptx: createExport(input: $pptx) {
                status
            }
            xlsx: createExport(input: $xlsx) {
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
            'xlsx' => [
                'format' => ExportFormatType::XLSX,
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
            'xlsx' => [
                'status' => ExportStatusType::DONE,
            ],
        ],
    ],
];
