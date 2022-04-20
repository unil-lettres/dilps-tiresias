<?php

declare(strict_types=1);

namespace Application\Handler;

use Application\Model\Card;
use Doctrine\ORM\EntityManager;
use Ecodev\Felix\Service\ImageResizer;
use Psr\Container\ContainerInterface;

class ImageFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $entityManager = $container->get(EntityManager::class);
        $imageResizer = $container->get(ImageResizer::class);

        return new ImageHandler($entityManager->getRepository(Card::class), $imageResizer);
    }
}
