<?php

declare(strict_types=1);

namespace Application\Middleware;

use Application\Model\Card;
use Doctrine\ORM\EntityManager;
use Interop\Container\ContainerInterface;

class LegacyRedirectFactory
{
    public function __invoke(ContainerInterface $container): LegacyRedirectMiddleware
    {
        $entityManager = $container->get(EntityManager::class);

        return new LegacyRedirectMiddleware($entityManager->getRepository(Card::class), $container);
    }
}
