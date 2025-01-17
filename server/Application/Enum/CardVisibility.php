<?php

declare(strict_types=1);

namespace Application\Enum;

use Ecodev\Felix\Api\Enum\LocalizedPhpEnumType;

enum CardVisibility: string implements LocalizedPhpEnumType
{
    case Private = 'private';
    case Member = 'member';
    case Public = 'public';

    public function getDescription(): string
    {
        return match ($this) {
            self::Private => 'Visible only to owner',
            self::Member => 'Visible to any logged-in users',
            self::Public => 'Visible to everyone, included non-logged user',
        };
    }
}
