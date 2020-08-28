<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Model\Card;
use Imagine\Image\Box;
use Imagine\Image\ImagineInterface;

/**
 * Service to resize card's images
 */
class ImageService
{
    private const CACHE_IMAGE_PATH = 'data/cache/images/';

    /**
     * @var ImagineInterface
     */
    private $imagine;

    public function __construct(ImagineInterface $imagine)
    {
        $this->imagine = $imagine;
    }

    /**
     * Resize image as JPG and return the path to the resized version
     */
    public function resize(Card $card, int $maxHeight): string
    {
        if ($card->getHeight() <= $maxHeight) {
            return $card->getPath();
        }

        $basename = pathinfo($card->getFilename(), PATHINFO_FILENAME);
        $path = realpath('.') . '/' . self::CACHE_IMAGE_PATH . $basename . '-' . $maxHeight . '.jpg';

        if (file_exists($path)) {
            return $path;
        }

        $card = $this->imagine->open($card->getPath());
        $card->thumbnail(new Box(1000000, $maxHeight))->save($path);

        return $path;
    }
}
