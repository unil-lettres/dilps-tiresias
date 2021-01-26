<?php

declare(strict_types=1);

use Application\DBAL\Types\ExportFormatType;
use Application\DBAL\Types\SiteType;

return [
    [
        'query' => 'query ValidateExport($pptx: CreateExportInput!) {
            pptx: validateExport(input: $pptx)
        }',
        'variables' => [
            'pptx' => [
                'format' => ExportFormatType::PPTX,
                'cards' => [6005],
                'site' => SiteType::DILPS,
            ],
        ],
    ],
    [
        'data' => [
            'pptx' => null,
        ],
    ],
];
