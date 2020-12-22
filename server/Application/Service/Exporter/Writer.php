<?php

declare(strict_types=1);

namespace Application\Service\Exporter;

use Application\Model\Card;
use Application\Model\Export;

interface Writer
{
    public function getExtension(): string;

    public function initialize(Export $export, string $title): void;

    public function write(Card $card): void;

    public function finalize(): void;
}
