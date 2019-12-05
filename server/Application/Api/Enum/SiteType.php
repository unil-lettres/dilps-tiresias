<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\DBAL\Types\SiteType as S;

class SiteType extends AbstractEnumType
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
