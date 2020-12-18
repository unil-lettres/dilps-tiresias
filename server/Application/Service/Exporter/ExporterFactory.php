<?php

declare(strict_types=1);

namespace Application\Service\Exporter;

use Interop\Container\ContainerInterface;

class ExporterFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $zip = $container->get(Zip::class);
        $pptx = $container->get(Pptx::class);
        $xlsx = $container->get(Xlsx::class);

        return new Exporter($zip, $pptx, $xlsx);
    }
}
