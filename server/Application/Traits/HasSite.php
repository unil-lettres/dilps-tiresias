<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Enum\Site;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Api\Exception;

/**
 * Trait for all objects with a site to separate them from each other.
 */
trait HasSite
{
    #[ORM\Column(type: 'enum')]
    private Site $site;

    public function getSite(): Site
    {
        return $this->site;
    }

    /**
     * Set the site of a new object.
     *
     * An existing object cannot move to the other site, where ACL were never checked, and where the users of its
     * original site could not reach it anymore.
     */
    public function setSite(Site $site): void
    {
        if (isset($this->site) && $site !== $this->site) {
            throw new Exception('Cannot move an object to another site');
        }

        $this->site = $site;
    }
}
