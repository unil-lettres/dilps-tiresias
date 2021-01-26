<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Model\User;
use Ecodev\Felix\DBAL\Types\EnumType;

class UserTypeType extends EnumType
{
    protected function getPossibleValues(): array
    {
        return [
            User::TYPE_DEFAULT,
            User::TYPE_AAI,
            User::TYPE_LEGACY,
        ];
    }
}
