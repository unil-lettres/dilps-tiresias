<?php

declare(strict_types=1);

namespace Application\Enum;

use Ecodev\Felix\Api\Enum\LocalizedPhpEnumType;

enum UserType: string implements LocalizedPhpEnumType
{
    /**
     * Someone who is a normal user, not part of AAI.
     */
    case Default = 'default';

    /**
     * Someone who log in via AAI system.
     */
    case Aai = 'aai';

    /**
     * Empty shell used for legacy.
     */
    case Legacy = 'legacy';

    public function getDescription(): string
    {
        return match ($this) {
            self::Default => 'Someone who is a normal user, with login/password in DILPS',
            self::Aai => 'Someone who log in via AAI system',
            self::Legacy => 'Empty shell used for legacy',
        };
    }
}
