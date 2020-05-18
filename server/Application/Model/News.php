<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasImage;
use Application\Traits\HasName;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Application\Traits\HasSorting;
use Application\Traits\HasUrl;
use Doctrine\ORM\Mapping as ORM;

/**
 * A news
 *
 * @ORM\Entity(repositoryClass="Application\Repository\NewsRepository")
 */
class News extends AbstractModel implements HasSiteInterface
{
    private const IMAGE_PATH = 'htdocs/news-images/';

    use HasName;
    use HasSorting;
    use HasImage;
    use HasSite;
    use HasUrl;

    /**
     * @var string
     *
     * @ORM\Column(type="text")
     */
    private $description = '';

    /**
     * @var bool
     * @ORM\Column(type="boolean", options={"default" = false})
     */
    private $isActive = false;

    /**
     * Set description
     */
    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    /**
     * Get description
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * Relative URL to image
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
}
