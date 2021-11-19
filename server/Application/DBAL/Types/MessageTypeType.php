<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class MessageTypeType extends EnumType
{
    public const EXPORT_DONE = 'export_done';

    protected function getPossibleValues(): array
    {
        return [
            self::EXPORT_DONE,
        ];
    }
}
