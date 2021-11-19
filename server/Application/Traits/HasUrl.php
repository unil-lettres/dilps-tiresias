<?php

declare(strict_types=1);

namespace Application\Traits;

use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * Trait for all objects with an URL.
 */
trait HasUrl
{
    /**
     * @var string
     * @ORM\Column(type="string", options={"default" = ""})
     */
    private $url = '';

    /**
     * @API\Field(type="Url")
     */
    public function getUrl(): string
    {
        return $this->url;
    }

    /**
     * @API\Input(type="Url")
     */
    public function setUrl(string $url): void
    {
        $this->url = $url;
    }
}
