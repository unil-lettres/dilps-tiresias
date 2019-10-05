<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasImage;
use Application\Traits\HasName;
use Application\Traits\HasSorting;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * A news
 *
 * @ORM\Entity(repositoryClass="Application\Repository\NewsRepository")
 */
class News extends AbstractModel
{
    private const IMAGE_PATH = 'htdocs/news/';

    use HasName;
    use HasSorting;
    use HasImage;

    /**
     * @var string
     *
     * @ORM\Column(type="text")
     */
    private $description = '';

    /**
     * @var string
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $url = '';

    /**
     * Set description
     *
     * @param string $description
     */
    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * Relative URL to image
     *
     * @return string
     */
    public function getImageUrl(): string
    {
        return '/news/' . $this->getFilename();
    }

    /**
     * @API\Field(type="Url")
     *
     * @return string
     */
    public function getUrl(): string
    {
        return $this->url;
    }

    /**
     * @API\Input(type="Url")
     *
     * @param string $url
     */
    public function setUrl(string $url): void
    {
        $this->url = $url;
    }
}
