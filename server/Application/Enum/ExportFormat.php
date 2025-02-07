<?php

declare(strict_types=1);

namespace Application\Enum;

use Ecodev\Felix\Api\Enum\LocalizedPhpEnumType;

enum ExportFormat: string implements LocalizedPhpEnumType
{
    case Zip = 'zip';
    case Pptx = 'pptx';
    case Csv = 'csv';

    public function getDescription(): string
    {
        return match ($this) {
            self::Zip => 'Images',
            self::Pptx => 'PowerPoint',
            self::Csv => 'Excel',
        };
    }
}
