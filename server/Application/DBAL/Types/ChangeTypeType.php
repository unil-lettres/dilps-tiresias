<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Enum\ChangeType;
use Ecodev\Felix\DBAL\Types\PhpEnumType;

class ChangeTypeType extends PhpEnumType
{
    protected function getEnumType(): string
    {
        return ChangeType::class;
    }
}
