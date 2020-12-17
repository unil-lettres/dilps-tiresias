<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class ExportFormatType extends EnumType
{
    const ZIP = 'zip';
    const PPTX = 'pptx';
    const XLSX = 'xlsx';

    protected function getPossibleValues(): array
    {
        return [
            self::ZIP,
            self::PPTX,
            self::XLSX,
        ];
    }
}
