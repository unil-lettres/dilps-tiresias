<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Enum\CollectionVisibility;
use Ecodev\Felix\DBAL\Types\PhpEnumType;

class CollectionVisibilityType extends PhpEnumType
{
    protected function getEnumType(): string
    {
        return CollectionVisibility::class;
    }
}
