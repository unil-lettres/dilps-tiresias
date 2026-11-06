<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Api\FileException;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Api\Exception;
use GraphQL\Doctrine\Attribute as API;
use Psr\Http\Message\UploadedFileInterface;
use Throwable;

/**
 * Trait for all objects with a name.
 */
trait HasImage
{
    #[ORM\Column(type: 'string', length: 2000)]
    private string $filename = '';

    /**
     * Set the image file.
     */
    #[API\Input(type: '?GraphQL\Upload\UploadType')]
    public function setFile(UploadedFileInterface $file): void
    {
        try {
            $this->generateUniqueFilename($file->getClientFilename());
            $file->moveTo($this->getPath());

            $this->validateMimeType();
        } catch (Throwable $e) {
            throw new FileException($file, $e);
        }
    }

    /**
     * Set filename (without path).
     */
    #[API\Exclude]
    public function setFilename(string $filename): void
    {
        $this->filename = $filename;
    }

    /**
     * Get filename (without path).
     */
    #[API\Exclude]
    public function getFilename(): string
    {
        return $this->filename;
    }

    public function hasImage(): bool
    {
        return !empty($this->filename);
    }

    /**
     * Get absolute path to image on disk.
     */
    #[API\Exclude]
    public function getPath(): string
    {
        return realpath('.') . '/' . self::IMAGE_PATH . $this->getFilename();
    }

    /**
     * Automatically called by Doctrine when the object is deleted
     * Is called after database update because we can have issues on remove operation (like integrity test)
     * and it's preferable to keep a related file on drive before removing it definitely.
     */
    #[ORM\PostRemove]
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
            throw new Exception('Impossible de déterminer le type du fichier.');
        }

        if ($mime === 'image/svg') {
            $mime = 'image/svg+xml';
        }

        return $mime;
    }

    /**
     * Delete file and throw exception if MIME type is invalid.
     */
    private function validateMimeType(): void
    {
        $mime = $this->getMime();

        // Validate image mimetype
        $acceptedMimeTypes = [
            'image/bmp',
            'image/x-ms-bmp',
            'image/gif',
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/svg+xml',
            'image/tiff',
            'image/vnd.adobe.photoshop',
            'image/webp',
            'image/heif',
            'image/heic',
        ];

        if (!in_array($mime, $acceptedMimeTypes, true)) {
            $path = $this->getPath();
            unlink($path);

            throw new Exception('Le type de fichier « ' . $mime . " » n'est pas accepté.");
        }
    }

    /**
     * Generate unique filename while trying to preserve original extension, and create its file, empty.
     *
     * Simultaneous uploads may generate the same filename, but only one of them may create its file.
     */
    private function generateUniqueFilename(string $originalFilename): void
    {
        $extension = pathinfo($originalFilename, PATHINFO_EXTENSION);
        while (true) {
            $this->setFilename(uniqid() . ($extension ? '.' . $extension : ''));
            $path = $this->getPath();

            $handle = @fopen($path, 'xb');
            if ($handle) {
                fclose($handle);

                return;
            }

            if (!file_exists($path)) {
                throw new Exception("Le fichier n'a pas pu être créé.");
            }
        }
    }
}
