<?php

declare(strict_types=1);

namespace Application\Enum;

use Ecodev\Felix\Api\Enum\LocalizedPhpEnumType;

enum ChangeType: string implements LocalizedPhpEnumType
{
    case Create = 'create';
    case Update = 'update';
    case Delete = 'delete';

    public function getDescription(): string
    {
        return match ($this) {
            self::Create => 'Create a new card',
            self::Update => 'Update an existing card',
            self::Delete => 'Delete an existing card',
        };
    }
}
