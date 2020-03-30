<?php

declare(strict_types=1);

namespace Application\ORM;

use Application\ORM\Query\Filter\AclFilter;
use Psr\Container\ContainerInterface;

class EntityManagerFactory
{
    /**
     * Return the preferred driver available on this system
     *
     * @param ContainerInterface $container
     *
     * @return \Doctrine\ORM\EntityManager
     */
    public function __invoke(ContainerInterface $container)
    {
        $factory = new \Roave\PsrContainerDoctrine\EntityManagerFactory();
        $entityManger = $factory($container);

        $entityManger->getFilters()->enable(AclFilter::class);

        return $entityManger;
    }
}
