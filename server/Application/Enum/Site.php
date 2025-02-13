<?php

declare(strict_types=1);

namespace Application\Enum;

use Ecodev\Felix\Api\Enum\LocalizedPhpEnumType;

enum Site: string implements LocalizedPhpEnumType
{
    case Dilps = 'dilps';
    case Tiresias = 'tiresias';

    public function getDescription(): string
    {
        return match ($this) {
            self::Dilps => 'DILPS',
            self::Tiresias => 'Tiresias',
        };
    }
}
