<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Enum\ExportStatus;
use Ecodev\Felix\DBAL\Types\PhpEnumType;

class ExportStatusType extends PhpEnumType
{
    protected function getEnumType(): string
    {
        return ExportStatus::class;
    }
}
