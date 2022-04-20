<?php

declare(strict_types=1);

namespace Application\Middleware;

use Application\Model\Card;
use Doctrine\ORM\EntityManager;
use Psr\Container\ContainerInterface;

class CardsFetcherFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $entityManager = $container->get(EntityManager::class);

        return new CardsFetcherMiddleware($entityManager->getRepository(Card::class));
    }
}
