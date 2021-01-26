<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Model\Change;
use Ecodev\Felix\DBAL\Types\EnumType;

class ChangeTypeType extends EnumType
{
    protected function getPossibleValues(): array
    {
        return [
            Change::TYPE_CREATE,
            Change::TYPE_UPDATE,
            Change::TYPE_DELETE,
        ];
    }
}
