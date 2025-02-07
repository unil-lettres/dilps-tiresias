<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Enum\CardVisibility;
use Ecodev\Felix\DBAL\Types\PhpEnumType;

class CardVisibilityType extends PhpEnumType
{
    protected function getEnumType(): string
    {
        return CardVisibility::class;
    }
}
