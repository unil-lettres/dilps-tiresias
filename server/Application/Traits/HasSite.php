<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Enum\Site;
use Doctrine\ORM\Mapping as ORM;

/**
 * Trait for all objects with a site to separate them from each other.
 */
trait HasSite
{
    #[ORM\Column(type: 'Site')]
    private Site $site;

    public function getSite(): Site
    {
        return $this->site;
    }

    public function setSite(Site $site): void
    {
        $this->site = $site;
    }
}
