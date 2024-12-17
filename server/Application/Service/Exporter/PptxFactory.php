<?php

declare(strict_types=1);

namespace Application\Service\Exporter;

use Application\Service\ImageResizer;
use Imagine\Image\ImagineInterface;
use Psr\Container\ContainerInterface;

class PptxFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $imagine = $container->get(ImagineInterface::class);
        $imageResizer = $container->get(ImageResizer::class);

        return new Pptx($imageResizer, $imagine);
    }
}
