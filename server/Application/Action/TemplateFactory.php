<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\Country;
use Application\Model\DocumentType;
use Application\Model\Domain;
use Application\Model\Material;
use Application\Model\Period;
use Doctrine\ORM\EntityManager;
use Interop\Container\ContainerInterface;

class TemplateFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $entityManager = $container->get(EntityManager::class);

        return new TemplateAction(
            $entityManager->getRepository(Domain::class),
            $entityManager->getRepository(Period::class),
            $entityManager->getRepository(Country::class),
            $entityManager->getRepository(Material::class),
            $entityManager->getRepository(DocumentType::class),
        );
    }
}
