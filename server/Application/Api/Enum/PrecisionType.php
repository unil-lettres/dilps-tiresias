<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\DBAL\Types\PrecisionType as P;
use Ecodev\Felix\Api\Enum\EnumType;

class PrecisionType extends EnumType
{
    public function __construct()
    {
        $config = [
            P::LOCALITY => 'Localité',
            P::SITE => 'Site',
            P::BUILDING => 'Bâtiment',
        ];

        parent::__construct($config);
    }
}
