<?php

declare(strict_types=1);

namespace Application\Service;

use Imagine\Image\ImagineInterface;
use Laminas\ServiceManager\Factory\FactoryInterface;
use Psr\Container\ContainerInterface;

final class ImageResizerFactory implements FactoryInterface
{
    /**
     * Return the image service to be used to resize images.
     *
     * @param string $requestedName
     */
    public function __invoke(ContainerInterface $container, $requestedName, ?array $options = null): ImageResizer
    {
        /** @var ImagineInterface $imagine */
        $imagine = $container->get(ImagineInterface::class);

        return new ImageResizer($imagine);
    }
}
