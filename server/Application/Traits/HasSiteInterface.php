<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Enum\Site;

/**
 * Trait for all objects with a site to separate them from each other.
 */
interface HasSiteInterface
{
    public function getSite(): Site;

    public function setSite(Site $site): void;
}
