<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Api\Exception;
use Application\Model\User;

trait HasCode
{
    /**
     * @var null|string
     *
     * @ORM\Column(type="string", length=30, nullable=true)
     */
    private $code;

    /**
     * Set code
     *
     * @param null|string $code
     */
    public function setCode(?string $code): void
    {
        if ($code === '') {
            $code = null;
        }

        // Simple ACL check
        $currentRole = User::getCurrent() ? User::getCurrent()->getRole() : User::ROLE_ANONYMOUS;
        if ($code !== $this->code && $currentRole !== User::ROLE_ADMINISTRATOR) {
            throw new Exception('Only administrators are allowed to update card.code');
        }

        $this->code = $code;
    }

    /**
     * Get code
     *
     * @return null|string
     */
    public function getCode(): ?string
    {
        return $this->code;
    }
}
