<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\DBAL\Types\SiteType;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * Trait for all objects with a site to separate them from each other
 */
trait HasSite
{
    /**
     * @var string
     * @ORM\Column(type="Site")
     */
    private $site = SiteType::DILPS; // Temporary default value, but should be removed

    /**
     * @API\Field(type="Site")
     *
     * @return string
     */
    public function getSite(): string
    {
        return $this->site;
    }

    /**
     * @API\Input(type="Site")
     *
     * @param string $site
     */
    public function setSite(string $site): void
    {
        $this->site = $site;
    }
}
