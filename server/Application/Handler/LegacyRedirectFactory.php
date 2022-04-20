<?php

declare(strict_types=1);

namespace Application\Handler;

use Application\Model\Card;
use Doctrine\ORM\EntityManager;
use Psr\Container\ContainerInterface;

class LegacyRedirectFactory
{
    public function __invoke(ContainerInterface $container): LegacyRedirectHandler
    {
        $entityManager = $container->get(EntityManager::class);

        return new LegacyRedirectHandler($entityManager->getRepository(Card::class));
    }
}
