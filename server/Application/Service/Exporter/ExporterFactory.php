<?php

declare(strict_types=1);

namespace Application\Service\Exporter;

use Application\Model\Card;
use Application\Model\Export;
use Application\Service\MessageQueuer;
use Doctrine\ORM\EntityManager;
use Ecodev\Felix\Service\Mailer;
use Interop\Container\ContainerInterface;

class ExporterFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $zip = $container->get(Zip::class);
        $pptx = $container->get(Pptx::class);
        $xlsx = $container->get(Csv::class);
        $config = $container->get('config');
        $messageQueuer = $container->get(MessageQueuer::class);
        $mailer = $container->get(Mailer::class);
        $entityManager = $container->get(EntityManager::class);

        $cardRepository = $entityManager->getRepository(Card::class);
        $exportRepository = $entityManager->getRepository(Export::class);

        return new Exporter(
            $exportRepository,
            $cardRepository,
            $messageQueuer,
            $mailer,
            $zip,
            $pptx,
            $xlsx,
            $config['phpPath']
        );
    }
}
