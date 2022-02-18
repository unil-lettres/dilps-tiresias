<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class ExportFormatType extends EnumType
{
    final public const ZIP = 'zip';
    final public const PPTX = 'pptx';
    final public const CSV = 'csv';

    protected function getPossibleValues(): array
    {
        return [
            self::ZIP,
            self::PPTX,
            self::CSV,
        ];
    }
}
