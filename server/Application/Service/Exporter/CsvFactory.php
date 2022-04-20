<?php

declare(strict_types=1);

namespace Application\Service\Exporter;

use Psr\Container\ContainerInterface;

class CsvFactory
{
    public function __invoke(ContainerInterface $container)
    {
        return new Csv();
    }
}
