<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Enum\UserType;
use Ecodev\Felix\DBAL\Types\PhpEnumType;

class UserTypeType extends PhpEnumType
{
    protected function getEnumType(): string
    {
        return UserType::class;
    }
}
