<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\DBAL\Types\ExportStatusType as S;
use Ecodev\Felix\Api\Enum\EnumType;

class ExportStatusType extends EnumType
{
    public function __construct()
    {
        $config = [
            S::TODO => 'A faire',
            S::IN_PROGRESS => 'En cours',
            S::DONE => 'Terminé',
        ];

        parent::__construct($config);
    }
}
