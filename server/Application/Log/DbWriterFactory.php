<?php

declare(strict_types=1);

namespace Application\Log;

use Application\Model\Log;
use Doctrine\ORM\EntityManager;
use Ecodev\Felix\Log\EventCompleter;
use Ecodev\Felix\Log\Writer\Db;
use Laminas\ServiceManager\Factory\FactoryInterface;
use Psr\Container\ContainerInterface;

class DbWriterFactory implements FactoryInterface
{
    public function __invoke(ContainerInterface $container, $requestedName, ?array $options = null)
    {
        $logRepository = $container->get(EntityManager::class)->getRepository(Log::class);
        $eventCompleter = $container->get(EventCompleter::class);

        return new Db($logRepository, $eventCompleter);
    }
}
