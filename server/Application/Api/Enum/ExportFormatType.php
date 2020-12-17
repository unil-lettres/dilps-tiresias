<?php

declare(strict_types=1);

namespace Application\Api\Enum;

use Application\DBAL\Types\ExportFormatType as S;
use Ecodev\Felix\Api\Enum\EnumType;

class ExportFormatType extends EnumType
{
    public function __construct()
    {
        $config = [
            S::ZIP => 'Images',
            S::PPTX => 'PowerPoint',
            S::XLSX => 'Excel',
        ];

        parent::__construct($config);
    }
}
