<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class PrecisionType extends EnumType
{
    final public const LOCALITY = 'locality';
    final public const SITE = 'site';
    final public const BUILDING = 'building';

    protected function getPossibleValues(): array
    {
        return [
            self::LOCALITY,
            self::SITE,
            self::BUILDING,
        ];
    }
}
