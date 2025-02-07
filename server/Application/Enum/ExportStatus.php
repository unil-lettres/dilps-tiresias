<?php

declare(strict_types=1);

namespace Application\Enum;

use Ecodev\Felix\Api\Enum\LocalizedPhpEnumType;

enum ExportStatus: string implements LocalizedPhpEnumType
{
    case Todo = 'todo';
    case InProgress = 'in_progress';
    case Done = 'done';
    case Errored = 'errored';

    public function getDescription(): string
    {
        return match ($this) {
            self::Todo => 'A faire',
            self::InProgress => 'En cours',
            self::Done => 'Terminé',
            self::Errored => 'Erreur',
        };
    }
}
