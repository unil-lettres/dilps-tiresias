<?php

declare(strict_types=1);

namespace Application\Enum;

use Ecodev\Felix\Api\Enum\LocalizedPhpEnumType;

enum Precision: string implements LocalizedPhpEnumType
{
    case Locality = 'locality';
    case Site = 'site';
    case Building = 'building';

    public function getDescription(): string
    {
        return match ($this) {
            self::Locality => 'Localité',
            self::Site => 'Site',
            self::Building => 'Bâtiment',
        };
    }
}
