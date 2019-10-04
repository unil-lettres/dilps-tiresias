<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\DBAL\Types\PrecisionType as P;

class PrecisionType extends AbstractEnumType
{
    public function __construct()
    {
        $config = [
            P::LOCALITY => 'Geolocation at locality level',
            P::SITE => 'Geolocation at site level',
            P::BUILDING => 'Geolocation at building level',
        ];

        parent::__construct($config);
    }
}
