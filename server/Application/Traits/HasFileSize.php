<?php

declare(strict_types=1);

namespace Application\Traits;

use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * Trait for all objects with file size.
 */
trait HasFileSize
{
    /**
     * @var int
     *
     * @ORM\Column(type="integer")
     */
    private $fileSize = 0;

    /**
     * Get file size in bytes.
     */
    public function getFileSize(): int
    {
        return $this->fileSize;
    }

    /**
     * Set file size in bytes.
     *
     * @API\Exclude
     */
    public function setFileSize(int $fileSize): void
    {
        $this->fileSize = $fileSize;
    }
}
