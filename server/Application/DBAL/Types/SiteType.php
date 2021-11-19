<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class SiteType extends EnumType
{
    public const DILPS = 'dilps';
    public const TIRESIAS = 'tiresias';

    protected function getPossibleValues(): array
    {
        return [
            self::DILPS,
            self::TIRESIAS,
        ];
    }
}
