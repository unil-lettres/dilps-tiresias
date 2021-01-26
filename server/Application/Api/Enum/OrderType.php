<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Ecodev\Felix\Api\Enum\EnumType;

class OrderType extends EnumType
{
    public function __construct()
    {
        $config = [
            'ASC' => 'Order ascending',
            'DESC' => 'Order descending',
        ];

        parent::__construct($config);
    }
}
