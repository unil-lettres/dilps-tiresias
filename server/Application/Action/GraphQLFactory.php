<?php

declare(strict_types=1);

namespace Application\Action;

use Doctrine\ORM\EntityManager;
use Interop\Container\ContainerInterface;

class GraphQLFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $entityManager = $container->get(EntityManager::class);
        $site = $container->get('site');

        return new GraphQLAction($entityManager, $site);
    }
}
