<?php

declare(strict_types=1);

namespace Application\Traits;

/**
 * Trait for all objects with a site to separate them from each other
 */
interface HasSiteInterface
{
    /**
     * @return string
     */
    public function getSite(): string;

    /**
     * @param string $site
     */
    public function setSite(string $site): void;
}
