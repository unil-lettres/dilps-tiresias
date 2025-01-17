<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Application\Enum\Site;
use Ecodev\Felix\DBAL\Types\PhpEnumType;

class SiteType extends PhpEnumType
{
    protected function getEnumType(): string
    {
        return Site::class;
    }
}
