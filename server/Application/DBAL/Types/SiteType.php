<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

class SiteType extends AbstractEnumType
{
    const DILPS = 'dilps';
    const TIRESIAS = 'tiresias';

    protected function getPossibleValues(): array
    {
        return [
            self::DILPS,
            self::TIRESIAS,
        ];
    }
}
