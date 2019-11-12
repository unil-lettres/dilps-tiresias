<?php

declare(strict_types=1);

namespace Application\Traits;

use Doctrine\Common\Collections\Collection;

/**
 * Any object which has a parent, modeling a hierarchy of objects
 */
interface HasParentInterface
{
    /**
     * Get name
     *
     * @return string
     */
    public function getName(): string;

    /**
     * Returns the parent, or null if this is a root object
     *
     * @return null|HasParentInterface
     */
    public function getParent(): ?self;

    /**
     * Get children objects
     *
     * @return Collection
     */
    public function getChildren(): Collection;
}
