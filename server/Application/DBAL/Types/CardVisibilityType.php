<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Model\Card;
use Ecodev\Felix\DBAL\Types\EnumType;

class CardVisibilityType extends EnumType
{
    protected function getPossibleValues(): array
    {
        return [
            Card::VISIBILITY_PRIVATE,
            Card::VISIBILITY_MEMBER,
            Card::VISIBILITY_PUBLIC,
        ];
    }
}
