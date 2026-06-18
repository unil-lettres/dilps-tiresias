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
    public const TMP_IMAGE_PATH = 'data/tmp/';

    public function __construct(
        private readonly ImagineInterface $imagine,
    ) {}

    /**
     * Resize image as JPG or WebP and return the path to the resized version.
     *
     * @param Image $image The image to resize
     * @param int $maxHeight The height to resize to. Will be capped to the original image height.
     * @param bool $useWebp Whether to use WebP format or JPG
     * @param bool $tmpFolder Whether to store the resized image in the temporary folder or in the cache folder
     *
     * @return string The path to the resized image
     */
    public function resize(Image $image, int $maxHeight, bool $useWebp, bool $tmpFolder): string
    {
        $path = $this->getPath($image, $maxHeight, $useWebp, $tmpFolder);

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
        $path = $this->getPath($image, $maxHeight, $useWebp, false);

        return !file_exists($path);
    }

    protected function getFullPath(Image $image, string $prefix, string $suffix, string $folder): string
    {
        $basename = pathinfo($image->getFilename(), PATHINFO_FILENAME);

        return realpath('.') . '/' . $folder . $prefix . $basename . $suffix;
    }

    /**
     * Return the path to use to display the image, or null if if no one fit.
     */
    protected function getPath(Image $image, int $maxHeight, bool $useWebp, bool $tmpFolder): string
    {
        if ($image->getMime() === 'image/svg+xml') {
            return $image->getPath();
        }

        $maxHeight = min($maxHeight, $image->getHeight());
        $extension = $useWebp ? '.webp' : '.jpg';

        $suffix = '-' . $maxHeight;

        if ($tmpFolder) {
            $prefix = 'resized-';
            $suffix .= '-' . bin2hex(random_bytes(8));
        }
        $suffix .= $extension;

        $folder = $tmpFolder ? self::TMP_IMAGE_PATH : self::CACHE_IMAGE_PATH;

        return $this->getFullPath($image, $prefix ?? '', $suffix, $folder);
    }
}
