<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\Model\User;
use Ecodev\Felix\Api\Enum\EnumType;

class UserTypeType extends EnumType
{
    public function __construct()
    {
        $config = [
            User::TYPE_DEFAULT => 'Someone who is a normal user, with login/password in DILPS',
            User::TYPE_AAI => 'Someone who log in via AAI system',
            User::TYPE_LEGACY => 'Empty shell used for legacy',
        ];

        parent::__construct($config);
    }
}
