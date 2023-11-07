<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Api\Enum\SiteType;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Attribute as API;

/**
 * Trait for all objects with a site to separate them from each other.
 */
trait HasSite
{
    /**
     * @var string
     */
    #[ORM\Column(type: 'Site')]
    private $site;

    #[API\Field(type: SiteType::class)]
    public function getSite(): string
    {
        return $this->site;
    }

    #[API\Input(type: SiteType::class)]
    public function setSite(string $site): void
    {
        $this->site = $site;
    }
}
