<?php

declare(strict_types=1);

return [
    [
        'query' => 'query ValidateExport($pptx: CreateExportInput!) {
            pptx: validateExport(input: $pptx)
        }',
        'variables' => [
            'pptx' => [
                'format' => Application\Enum\ExportFormat::Pptx,
                'cards' => [6005],
                'site' => Application\Enum\Site::Dilps,
            ],
        ],
    ],
    [
        'data' => [
            'pptx' => null,
        ],
    ],
];
