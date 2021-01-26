<?php

declare(strict_types=1);

namespace Application\Service\Exporter;

use Ecodev\Felix\Service\ImageResizer;
use Imagine\Image\ImagineInterface;
use Interop\Container\ContainerInterface;

class ZipFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $imagine = $container->get(ImagineInterface::class);
        $imageResizer = $container->get(ImageResizer::class);

        return new Zip($imageResizer, $imagine);
    }
}
