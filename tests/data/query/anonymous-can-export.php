<?php

declare(strict_types=1);

use Application\DBAL\Types\ExportFormatType;
use Application\DBAL\Types\ExportStateType;
use Application\DBAL\Types\SiteType;

return [
    [
        'query' => 'mutation CreateExport($zip: CreateExportInput!, $pptx: CreateExportInput!, $xlsx: CreateExportInput!) {
            zip: createExport(input: $zip) {
                state
            }
            pptx: createExport(input: $pptx) {
                state
            }
            xlsx: createExport(input: $xlsx) {
                state
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
                'state' => ExportStateType::DONE,
            ],
            'pptx' => [
                'state' => ExportStateType::DONE,
            ],
            'xlsx' => [
                'state' => ExportStateType::DONE,
            ],
        ],
    ],
];
