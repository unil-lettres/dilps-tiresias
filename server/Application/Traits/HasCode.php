<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Model\User;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Api\Exception;

trait HasCode
{
    #[ORM\Column(type: 'string', length: 30, nullable: true)]
    private ?string $code = null;

    /**
     * Set code.
     */
    public function setCode(?string $code): void
    {
        if ($code === '') {
            $code = null;
        }

        if ($code !== $this->code && !$this->canUpdateCode()) {
            throw new Exception('Only majors and administrators are allowed to update card.code');
        }

        $this->code = $code;
    }

    /**
     * Get code.
     */
    public function getCode(): ?string
    {
        return $this->code;
    }

    /**
     * Simple ACL check.
     */
    private function canUpdateCode(): bool
    {
        $whitelist = [
            User::ROLE_MAJOR,
            User::ROLE_ADMINISTRATOR,
        ];

        $currentRole = User::getCurrent() ? User::getCurrent()->getRole() : User::ROLE_ANONYMOUS;

        return in_array($currentRole, $whitelist, true);
    }
}
