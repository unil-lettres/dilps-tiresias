<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\File;
use Doctrine\ORM\EntityManager;
use Ecodev\Felix\Action\FileAction;
use Interop\Container\ContainerInterface;

class FileFactory
{
    public function __invoke(ContainerInterface $container): FileAction
    {
        $entityManager = $container->get(EntityManager::class);

        return new FileAction($entityManager->getRepository(File::class));
    }
}
