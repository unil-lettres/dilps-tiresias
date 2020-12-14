<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\Card;
use Doctrine\ORM\EntityManager;
use Ecodev\Felix\Service\ImageResizer;
use Interop\Container\ContainerInterface;

class ImageFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $entityManager = $container->get(EntityManager::class);
        $imageResizer = $container->get(ImageResizer::class);

        return new ImageAction($entityManager->getRepository(Card::class), $imageResizer);
    }
}
