<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class ExportStatusType extends EnumType
{
    final public const TODO = 'todo';
    final public const IN_PROGRESS = 'in_progress';
    final public const DONE = 'done';
    final public const ERRORED = 'errored';

    protected function getPossibleValues(): array
    {
        return [
            self::TODO,
            self::IN_PROGRESS,
            self::DONE,
            self::ERRORED,
        ];
    }
}
