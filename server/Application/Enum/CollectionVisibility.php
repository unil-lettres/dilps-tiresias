<?php

declare(strict_types=1);

namespace Application\Enum;

use Ecodev\Felix\Api\Enum\LocalizedPhpEnumType;

enum CollectionVisibility: string implements LocalizedPhpEnumType
{
    case Private = 'private';
    case Administrator = 'administrator';
    case Member = 'member';

    public function getDescription(): string
    {
        return match ($this) {
            self::Private => 'Visible only to owner',
            self::Administrator => 'Visible to administrators',
            self::Member => 'Visible to any logged-in users',
        };
    }
}
