<?php

declare(strict_types=1);

namespace Application\Service\Exporter;

use Application\Service\ImageResizer;
use Psr\Container\ContainerInterface;

class ZipFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $imageResizer = $container->get(ImageResizer::class);

        return new Zip($imageResizer);
    }
}
