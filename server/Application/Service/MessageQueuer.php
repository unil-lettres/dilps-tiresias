<?php

declare(strict_types=1);

namespace Application\Service;

use Application\DBAL\Types\MessageTypeType;
use Application\Model\Export;
use Application\Model\Message;
use Application\Model\User;
use Doctrine\ORM\EntityManager;
use Ecodev\Felix\Service\MessageRenderer;

/**
 * Service to queue new message for pre-defined purposes.
 */
class MessageQueuer
{
    private EntityManager $entityManager;

    private MessageRenderer $messageRenderer;

    public function __construct(EntityManager $entityManager, MessageRenderer $messageRenderer)
    {
        $this->entityManager = $entityManager;
        $this->messageRenderer = $messageRenderer;
    }

    public function queueExportDone(User $user, Export $export): Message
    {
        $subject = 'Téléchargement prêt';
        $mailParams = [
            'export' => $export,
        ];

        $message = $this->createMessage($user, $user->getEmail(), $subject, MessageTypeType::EXPORT_DONE, $mailParams);

        return $message;
    }

    /**
     * Create a message by rendering the template.
     */
    private function createMessage(?User $user, string $email, string $subject, string $type, array $mailParams): Message
    {
        $content = $this->messageRenderer->render($user, $email, $subject, $type, $mailParams);

        $message = new Message();
        $message->setType($type);
        $message->setRecipient($user);
        $message->setSubject($subject);
        $message->setBody($content);
        $message->setEmail($email);
        $this->entityManager->persist($message);

        return $message;
    }
}
