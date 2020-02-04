<?php

declare(strict_types=1);

namespace Application\Traits;

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
