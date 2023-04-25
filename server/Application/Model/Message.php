<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\MessageRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * A message sent to a user.
 */
#[ORM\Entity(MessageRepository::class)]
class Message extends AbstractModel implements \Ecodev\Felix\Model\Message
{
    use \Ecodev\Felix\Model\Traits\Message;

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: User::class)]
    private ?User $recipient = null;

    /**
     * Set recipient.
     */
    public function setRecipient(?User $recipient): void
    {
        $this->recipient = $recipient;
        $this->setOwner($recipient);
    }

    /**
     * Get recipient.
     */
    public function getRecipient(): ?User
    {
        return $this->recipient;
    }
}
