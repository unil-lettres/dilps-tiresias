<?php

declare(strict_types=1);

namespace Application\Handler;

use Application\Model\Country;
use Application\Model\DocumentType;
use Application\Model\Domain;
use Application\Model\Material;
use Application\Model\Period;
use Doctrine\ORM\EntityManager;
use Psr\Container\ContainerInterface;

class TemplateFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $entityManager = $container->get(EntityManager::class);
        $site = $container->get('site');

        return new TemplateHandler(
            $site,
            $entityManager->getRepository(Domain::class),
            $entityManager->getRepository(Period::class),
            $entityManager->getRepository(Country::class),
            $entityManager->getRepository(Material::class),
            $entityManager->getRepository(DocumentType::class),
        );
    }
}
