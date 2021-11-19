<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class ExportStatusType extends EnumType
{
    public const TODO = 'todo';
    public const IN_PROGRESS = 'in_progress';
    public const DONE = 'done';
    public const ERRORED = 'errored';

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
