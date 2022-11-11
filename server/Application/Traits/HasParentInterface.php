<?php

declare(strict_types=1);

namespace Application\Traits;

use Doctrine\Common\Collections\Collection;

/**
 * Any object which has a parent, modeling a hierarchy of objects.
 */
interface HasParentInterface
{
    /**
     * Get name.
     */
    public function getName(): string;

    public function getHierarchicName(): string;

    /**
     * Returns the parent, or null if this is a root object.
     */
    public function getParent(): ?self;

    /**
     * Get children objects.
     */
    public function getChildren(): Collection;

    public function hasChildren(): bool;

    /**
     * @return self[]
     */
    public function getParentHierarchy(): array;
}
