<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Model\Message;
use Doctrine\ORM\EntityManager;
use Ecodev\Felix\Service\Mailer;
use Interop\Container\ContainerInterface;
use Laminas\Mail\Transport\TransportInterface;

class MailerFactory
{
    /**
     * Return a configured mailer
     */
    public function __invoke(ContainerInterface $container): Mailer
    {
        $entityManager = $container->get(EntityManager::class);
        $transport = $container->get(TransportInterface::class);
        $config = $container->get('config');

        $messageRepository = $entityManager->getRepository(Message::class);

        return new Mailer(
            $entityManager,
            $messageRepository,
            $transport,
            $config['phpPath'],
            $config['email']['toOverride'] ?? null,
            $config['email']['from'],
            'Dilps'
        );
    }
}
