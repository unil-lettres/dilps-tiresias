<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\DBAL\Types\SiteType as S;
use Ecodev\Felix\Api\Enum\EnumType;

class SiteType extends EnumType
{
    public function __construct()
    {
        $config = [
            S::DILPS => 'DILPS',
            S::TIRESIAS => 'Tiresias',
        ];

        parent::__construct($config);
    }
}
