<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class PrecisionType extends AbstractEnumType
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
