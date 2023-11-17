<?php

declare(strict_types=1);

namespace Application\Traits;

use Doctrine\ORM\Mapping as ORM;

/**
 * Trait for all objects with an optional year range.
 */
trait HasYearRange
{
    #[ORM\Column(name: '`from`', type: 'integer', nullable: true)]
    private ?int $from = null;

    #[ORM\Column(name: '`to`', type: 'integer', nullable: true)]
    private ?int $to = null;

    /**
     * Return the from year.
     */
    public function getFrom(): ?int
    {
        return $this->from;
    }

    public function setFrom(?int $from): void
    {
        $this->from = $from;
    }

    /**
     * Return the to year.
     */
    public function getTo(): ?int
    {
        return $this->to;
    }

    public function setTo(?int $to): void
    {
        $this->to = $to;
    }
}
