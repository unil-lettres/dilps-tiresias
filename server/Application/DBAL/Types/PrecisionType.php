<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class PrecisionType extends EnumType
{
    const LOCALITY = 'locality';
    const SITE = 'site';
    const BUILDING = 'building';

    protected function getPossibleValues(): array
    {
        return [
            self::LOCALITY,
            self::SITE,
            self::BUILDING,
        ];
    }
}
