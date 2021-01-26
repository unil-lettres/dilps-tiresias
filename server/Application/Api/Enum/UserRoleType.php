<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\Model\User;
use Ecodev\Felix\Api\Enum\EnumType;

class UserRoleType extends EnumType
{
    public function __construct()
    {
        $config = [
            User::ROLE_STUDENT => 'Etudiant',
            User::ROLE_JUNIOR => 'Etudiant junior',
            User::ROLE_SENIOR => 'Senior',
            User::ROLE_MAJOR => 'Major',
            User::ROLE_ADMINISTRATOR => 'Administrateur',
        ];

        parent::__construct($config);
    }
}
