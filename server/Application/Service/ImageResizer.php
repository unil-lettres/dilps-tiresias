<?php

declare(strict_types=1);

namespace Application\Service;

use Ecodev\Felix\Model\Image;
use Imagine\Image\Box;
use Imagine\Image\ImagineInterface;

/**
 * Service to resize image's images.
 */
class ImageResizer
{
    public const CACHE_IMAGE_PATH = 'data/cache/images/';

    public function __construct(private readonly ImagineInterface $imagine)
    {
    }

    /**
     * Resize image as JPG or WebP and return the path to the resized version.
     */
    public function resize(Image $image, int $maxHeight, bool $useWebp): string
    {
        if ($image->getMime() === 'image/svg+xml') {
            return $image->getPath();
        }

        $maxHeight = min($maxHeight, $image->getHeight());

        $extension = $useWebp ? '.webp' : '.jpg';
        $path = $this->getCachePath($image, '-' . $maxHeight . $extension);

        if (file_exists($path)) {
            return $path;
        }

        $image = $this->imagine->open($image->getPath());
        $image->thumbnail(new Box(1_000_000, $maxHeight))->save($path);

        return $path;
    }

    /**
     * Assumes the image is WebP, converts it to JPG, and return path to JPG version.
     */
    public function webpToJpg(Image $image): string
    {
        $path = $this->getCachePath($image, '.jpg');

        if (file_exists($path)) {
            return $path;
        }

        $image = $this->imagine->open($image->getPath());
        $image->save($path);

        return $path;
    }

    public function getCachePath(Image $image, string $suffix): string
    {
        $basename = pathinfo($image->getFilename(), PATHINFO_FILENAME);

        return realpath('.') . '/' . self::CACHE_IMAGE_PATH . $basename . $suffix;
    }
}
