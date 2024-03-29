<?php

declare(strict_types=1);

namespace Application\Middleware;

use Application\Model\User;
use Doctrine\ORM\EntityManager;
use Psr\Container\ContainerInterface;

class AuthenticationFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $entityManager = $container->get(EntityManager::class);
        $site = $container->get('site');

        return new AuthenticationMiddleware($entityManager->getRepository(User::class), $site);
    }
}
