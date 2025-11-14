<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Api\FileException;
use Application\FriendlyException;
use Application\Repository\NewsRepository;
use Application\Traits\HasImage;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Application\Traits\HasSorting;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;
use Ecodev\Felix\Model\Traits\HasUrl;
use GraphQL\Doctrine\Attribute as API;
use Imagine\Image\ImagineInterface;
use Psr\Http\Message\UploadedFileInterface;
use Throwable;

/**
 * A news.
 */
#[ORM\Entity(NewsRepository::class)]
class News extends AbstractModel implements HasSiteInterface
{
    private const IMAGE_PATH = 'htdocs/news-images/';

    use HasImage {
        setFile as traitSetFile;
    }
    use HasName;
    use HasSite;
    use HasSorting;
    use HasUrl;

    #[ORM\Column(type: 'text')]
    private string $description = '';

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private bool $isActive = false;

    /**
     * Set description.
     */
    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    /**
     * Get description.
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * Relative URL to image.
     */
    public function getImageUrl(): string
    {
        return '/news-images/' . $this->getFilename();
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): void
    {
        $this->isActive = $isActive;
    }

    /**
     * Set the image file and encode it to WebP.
     */
    #[API\Input(type: '?GraphQL\Upload\UploadType')]
    public function setFile(UploadedFileInterface $file): void
    {
        global $container;

        $this->traitSetFile($file);

        $mime = $this->getMime();

        if ($mime === 'image/svg+xml') {
            return;
        }

        try {
            /** @var ImagineInterface $imagine */
            $imagine = $container->get(ImagineInterface::class);
            $image = FriendlyException::try(fn () => $imagine->open($this->getPath()));

            // Resize if too large
            $size = $image->getSize();
            if ($size->getWidth() > 1200 || $size->getHeight() > 1200) {
                $image = $image->thumbnail(new \Imagine\Image\Box(1200, 1200));
            }

            // Delete original file
            unlink($$this->getPath());

            // Save as WebP
            $this->setFilename(pathinfo($this->getFilename(), PATHINFO_FILENAME) . '.webp');
            FriendlyException::try(fn () => $image->save($this->getPath()));
        } catch (Throwable $e) {
            throw new FileException($file, $e);
        }
    }
}
