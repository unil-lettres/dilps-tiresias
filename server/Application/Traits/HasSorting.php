<?php

declare(strict_types=1);

namespace Application\Traits;

/**
 * A field to arbitrarily sort records
 */
trait HasSorting
{
    /**
     * @var int
     *
     * @ORM\Column(type="integer", options={"default" = 0})
     */
    private $sorting = 0;

    /**
     * Set sorting
     */
    public function setSorting(int $sorting): void
    {
        $this->sorting = $sorting;
    }

    /**
     * Get sorting
     */
    public function getSorting(): int
    {
        return $this->sorting;
    }
}
