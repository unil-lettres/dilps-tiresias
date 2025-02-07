<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Enum\ExportFormat;
use Ecodev\Felix\DBAL\Types\PhpEnumType;

class ExportFormatType extends PhpEnumType
{
    protected function getEnumType(): string
    {
        return ExportFormat::class;
    }
}
