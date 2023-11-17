<?php

declare(strict_types=1);

namespace Application\Traits;

use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Attribute as API;

/**
 * Trait for all objects with file size.
 */
trait HasFileSize
{
    #[ORM\Column(type: 'integer')]
    private int $fileSize = 0;

    /**
     * Get file size in bytes.
     */
    public function getFileSize(): int
    {
        return $this->fileSize;
    }

    /**
     * Set file size in bytes.
     */
    #[API\Exclude]
    public function setFileSize(int $fileSize): void
    {
        $this->fileSize = $fileSize;
    }
}
