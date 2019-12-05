<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Model\User;

class UserTypeType extends AbstractEnumType
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
