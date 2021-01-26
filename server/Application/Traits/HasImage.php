<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Api\FileException;
use Doctrine\ORM\Mapping as ORM;
use Exception;
use GraphQL\Doctrine\Annotation as API;
use Psr\Http\Message\UploadedFileInterface;
use Throwable;

/**
 * Trait for all objects with a name
 */
trait HasImage
{
    /**
     * @var string
     *
     * @ORM\Column(type="string", length=2000)
     */
    private $filename = '';

    /**
     * Set the image file
     *
     * @API\Input(type="?GraphQL\Upload\UploadType")
     */
    public function setFile(UploadedFileInterface $file): void
    {
        try {
            $this->generateUniqueFilename($file->getClientFilename());

            $path = $this->getPath();
            if (file_exists($path)) {
                throw new Exception('A file already exist with the same name: ' . $this->getFilename());
            }
            $file->moveTo($path);

            $this->validateMimeType();
        } catch (Throwable $e) {
            throw new FileException($file, $e);
        }
    }

    /**
     * Set filename (without path)
     *
     * @API\Exclude
     */
    public function setFilename(string $filename): void
    {
        $this->filename = $filename;
    }

    /**
     * Get filename (without path)
     *
     * @API\Exclude
     */
    public function getFilename(): string
    {
        return $this->filename;
    }

    public function hasImage(): bool
    {
        return !empty($this->filename);
    }

    /**
     * Get absolute path to image on disk
     *
     * @API\Exclude
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
        global $container;
        $config = $container->get('config');
        $unlink = $config['files']['unlink'];

        if (file_exists($path) && is_file($path)) {
            if ($this->getFilename() !== 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg' && $unlink) {
                unlink($path);
            }
        }
    }

    public function getMime(): string
    {
        $path = $this->getPath();
        $mime = mime_content_type($path);
        if ($mime === false) {
            throw new Exception('Could not get mimetype for path: ' . $path);
        }

        if ($mime === 'image/svg') {
            $mime = 'image/svg+xml';
        }

        return $mime;
    }

    /**
     * Delete file and throw exception if MIME type is invalid
     */
    private function validateMimeType(): void
    {
        $mime = $this->getMime();

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
            $path = $this->getPath();
            unlink($path);

            throw new Exception('Invalid file type of: ' . $mime);
        }
    }

    /**
     * Generate unique filename while trying to preserver original extension
     */
    private function generateUniqueFilename(string $originalFilename): void
    {
        $extension = pathinfo($originalFilename, PATHINFO_EXTENSION);
        $filename = uniqid() . ($extension ? '.' . $extension : '');
        $this->setFilename($filename);
    }
}
