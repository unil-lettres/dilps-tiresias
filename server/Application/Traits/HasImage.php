<?php

declare(strict_types=1);

namespace Application\Traits;

use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;
use Psr\Http\Message\UploadedFileInterface;

/**
 * Trait for all objects with a name
 */
trait HasImage
{
    /**
     * @var string
     * @ORM\Column(type="string", length=2000)
     */
    private $filename = '';

    /**
     * Set the image file
     *
     * @API\Input(type="?GraphQL\Upload\UploadType")
     *
     * @param UploadedFileInterface $file
     *
     * @throws \Exception
     */
    public function setFile(UploadedFileInterface $file): void
    {
        $this->generateUniqueFilename($file->getClientFilename());

        $path = $this->getPath();
        if (file_exists($path)) {
            throw new \Exception('A file already exist with the same name: ' . $this->getFilename());
        }
        $file->moveTo($path);

        $this->validateMimeType();
    }

    /**
     * Set filename (without path)
     *
     * @API\Exclude
     *
     * @param string $filename
     */
    public function setFilename(string $filename): void
    {
        $this->filename = $filename;
    }

    /**
     * Get filename (without path)
     *
     * @API\Exclude
     *
     * @return string
     */
    public function getFilename(): string
    {
        return $this->filename;
    }

    /**
     * @return bool
     */
    public function hasImage(): bool
    {
        return !empty($this->filename);
    }

    /**
     * Get absolute path to image on disk
     *
     * @API\Exclude
     *
     * @return string
     */
    public function getPath(): string
    {
        return realpath('.') . '/' . self::IMAGE_PATH . $this->getFilename();
    }

    /**
     * Automatically called by Doctrine when the object is deleted
     * Is called after database update because we can have issues on remove operation (like integrity test)
     * and it's preferable to keep a related file on drive before removing it definitely.
     *
     * @ORM\PostRemove
     */
    public function deleteFile(): void
    {
        $path = $this->getPath();
        $config = require 'config/autoload/local.php';
        $unlink = $config['files']['unlink'];

        if (file_exists($path) && is_file($path)) {
            if ($this->getFilename() !== 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg' && $unlink) {
                unlink($path);
            }
        }
    }

    /**
     * Delete file and throw exception if MIME type is invalid
     *
     * @throws \Exception
     */
    private function validateMimeType(): void
    {
        $path = $this->getPath();
        $mime = mime_content_type($path);

        // Validate image mimetype
        $acceptedMimeTypes = [
            'image/bmp',
            'image/gif',
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/svg+xml',
            'image/tiff',
            'image/vnd.adobe.photoshop',
            'image/webp',
        ];

        if (!in_array($mime, $acceptedMimeTypes, true)) {
            unlink($path);

            throw new \Exception('Invalid file type of: ' . $mime);
        }
    }

    /**
     * Generate unique filename while trying to preserver original extension
     *
     * @param string $originalFilename
     */
    private function generateUniqueFilename(string $originalFilename): void
    {
        $extension = pathinfo($originalFilename, PATHINFO_EXTENSION);
        $filename = uniqid() . ($extension ? '.' . $extension : '');
        $this->setFilename($filename);
    }
}