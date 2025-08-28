<?php

declare(strict_types=1);

namespace Application\Service;

use Application\FriendlyException;
use Ecodev\Felix\Model\Image;
use Imagine\Image\Box;
use Imagine\Image\ImagineInterface;

/**
 * Service to resize image's images.
 */
class ImageResizer
{
    public const CACHE_IMAGE_PATH = 'data/cache/images/';

    public function __construct(
        private readonly ImagineInterface $imagine,
    ) {}

    /**
     * Resize image as JPG or WebP and return the path to the resized version.
     */
    public function resize(Image $image, int $maxHeight, bool $useWebp): string
    {
        $path = $this->getPath($image, $maxHeight, $useWebp);

        if (file_exists($path)) {
            return $path;
        }

        $image = $this->imagine->open($image->getPath());
        $image = $image->thumbnail(new Box(1_000_000, $maxHeight));
        FriendlyException::try(fn () => $image->save($path));

        return $path;
    }

    public function isResizeNeeded(Image $image, int $maxHeight, bool $useWebp): bool
    {
        $path = $this->getPath($image, $maxHeight, $useWebp);

        return !file_exists($path);
    }

    public function getCachePath(Image $image, string $suffix): string
    {
        $basename = pathinfo($image->getFilename(), PATHINFO_FILENAME);

        return realpath('.') . '/' . self::CACHE_IMAGE_PATH . $basename . $suffix;
    }

    /**
     * Return the path to use to display the image, or null if if no one fit.
     */
    protected function getPath(Image $image, int $maxHeight, bool $useWebp): string
    {
        if ($image->getMime() === 'image/svg+xml') {
            return $image->getPath();
        }

        $maxHeight = min($maxHeight, $image->getHeight());
        $extension = $useWebp ? '.webp' : '.jpg';
        $path = $this->getCachePath($image, '-' . $maxHeight . $extension);

        return $path;
    }
}
