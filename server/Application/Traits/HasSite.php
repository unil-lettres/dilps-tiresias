<?php

declare(strict_types=1);

namespace Application\Traits;

use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * Trait for all objects with a site to separate them from each other.
 */
trait HasSite
{
    /**
     * @var string
     *
     * @ORM\Column(type="Site")
     */
    private $site;

    /**
     * @API\Field(type="Site")
     */
    public function getSite(): string
    {
        return $this->site;
    }

    /**
     * @API\Input(type="Site")
     */
    public function setSite(string $site): void
    {
        $this->site = $site;
    }
}
