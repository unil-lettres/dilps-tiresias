<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\Model\Change;
use Ecodev\Felix\Api\Enum\EnumType;

class ChangeTypeType extends EnumType
{
    public function __construct()
    {
        $config = [
            Change::TYPE_CREATE => 'Create a new card',
            Change::TYPE_UPDATE => 'Update an existing card',
            Change::TYPE_DELETE => 'Delete an existing card',
        ];

        parent::__construct($config);
    }
}
