<?php

declare(strict_types=1);

namespace Application\Traits;

use Doctrine\Common\Collections\Collection;
use InvalidArgumentException;

/**
 * Trait for all objects with a parent.
 *
 * ORM mapping must be defined in using class.
 */
trait HasParent
{
    /**
     * @var null|HasParentInterface
     */
    private $parent;

    /**
     * @var Collection
     */
    private $children;

    /**
     * Get the parent containing this object.
     *
     * @return null|self
     */
    public function getParent(): ?HasParentInterface
    {
        return $this->parent;
    }

    /**
     * Set the parent containing this object.
     *
     * @param null|self $parent
     */
    public function setParent(?self $parent): void
    {
        // Remove from previous parent
        if ($this->parent) {
            $this->parent->getChildren()->removeElement($this);
        }

        // Add to new parent
        if ($parent) {
            $this->assertNotCyclic($parent);
            $parent->children->add($this);
        }

        $this->parent = $parent;
    }

    /**
     * Get children
     *
     * @return Collection
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }

    /**
     * Has children
     *
     * @return bool
     */
    public function hasChildren(): bool
    {
        return $this->getChildren()->count() > 0;
    }

    private function assertNotCyclic(HasParentInterface $parentCandidate): void
    {
        $allChildren = $this->getAllChildren();

        while ($parentCandidate) {
            if (in_array($parentCandidate, $allChildren, true)) {
                throw new InvalidArgumentException('Parent object is invalid because it would create a cyclic hierarchy');
            }

            $parentCandidate = $parentCandidate->getParent();
        }
    }

    /**
     * Get recursively all children and grand-children
     *
     * @return HasParentInterface[]
     */
    private function getAllChildren(): array
    {
        $allChildren = [];
        foreach ($this->getChildren() as $child) {
            $allChildren[] = $child;
            $allChildren = array_merge($allChildren, $child->getAllChildren());
        }

        return $allChildren;
    }

    /**
     * @return string
     */
    public function getHierarchicName(): string
    {
        $object = $this;
        $result = [];

        while ($object) {
            $result[] = $object->getName();
            $object = $object->getParent();
        }

        return implode(' > ', array_reverse($result));
    }

    /**
     * @return self[]
     */
    public function getParentHierarchy(): array
    {
        $list = [];
        $parent = $this->getParent();

        if ($parent) {
            return array_merge($parent->getParentHierarchy(), [$parent]);
        }

        return $list;
    }
}
