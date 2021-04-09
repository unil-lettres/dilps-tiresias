<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Ecodev\Felix\DBAL\Types\EnumType;

class ExportStatusType extends EnumType
{
    const TODO = 'todo';
    const IN_PROGRESS = 'in_progress';
    const DONE = 'done';
    const ERRORED = 'errored';

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
