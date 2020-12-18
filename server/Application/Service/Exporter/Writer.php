<?php

declare(strict_types=1);

namespace Application\Service\Exporter;

use Application\Model\Export;

interface Writer
{
    public function getExtension(): string;

    public function write(Export $export, string $title): void;
}
