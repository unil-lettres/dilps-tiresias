<?php

declare(strict_types=1);

namespace Application\Handler;

use Ecodev\Felix\Service\ImageResizer;
use Imagine\Image\ImagineInterface;
use Interop\Container\ContainerInterface;

class PptxFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $imagine = $container->get(ImagineInterface::class);
        $imageResizer = $container->get(ImageResizer::class);
        $site = $container->get('site');

        return new PptxHandler($imageResizer, $imagine, $site);
    }
}
