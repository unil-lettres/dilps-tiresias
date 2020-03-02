<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Service\ImageService;
use Imagine\Image\ImagineInterface;
use Interop\Container\ContainerInterface;

class ZipFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $imagine = $container->get(ImagineInterface::class);
        $imageService = $container->get(ImageService::class);
        $site = $container->get('site');

        return new ZipAction($imageService, $imagine, $site);
    }
}
