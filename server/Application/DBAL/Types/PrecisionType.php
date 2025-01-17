<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Enum\Precision;
use Ecodev\Felix\DBAL\Types\PhpEnumType;

class PrecisionType extends PhpEnumType
{
    protected function getEnumType(): string
    {
        return Precision::class;
    }
}
