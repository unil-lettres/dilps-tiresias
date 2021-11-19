<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class ExportFormatType extends EnumType
{
    public const ZIP = 'zip';
    public const PPTX = 'pptx';
    public const CSV = 'csv';

    protected function getPossibleValues(): array
    {
        return [
            self::ZIP,
            self::PPTX,
            self::CSV,
        ];
    }
}
