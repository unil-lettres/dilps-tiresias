<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasInstitution;
use Application\Traits\HasName;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection as DoctrineCollection;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;
use InvalidArgumentException;

/**
 * A collection of cards
 *
 * @ORM\Entity(repositoryClass="Application\Repository\CollectionRepository")
 * @ORM\Table(indexes={@ORM\Index(name="collection_name_idx", columns={"name"})})
 */
class Collection extends AbstractModel
{
    use HasName;
    use HasInstitution;

    const VISIBILITY_PRIVATE = 'private';
    const VISIBILITY_ADMINISTRATOR = 'administrator';
    const VISIBILITY_MEMBER = 'member';

    /**
     * @var string
     * @ORM\Column(type="CollectionVisibility", options={"default" = Collection::VISIBILITY_PRIVATE})
     */
    private $visibility = self::VISIBILITY_PRIVATE;

    /**
     * Return whether this is publicly available to only to member, or only administrators, or only owner
     *
     * @API\Field(type="Application\Api\Enum\CollectionVisibilityType")
     *
     * @return string
     */
    public function getVisibility(): string
    {
        return $this->visibility;
    }

    /**
     * Set whether this is publicly available to only to member, or only administrators, or only owner
     *
     * @API\Input(type="Application\Api\Enum\CollectionVisibilityType")
     *
     * @param string $visibility
     */
    public function setVisibility(string $visibility): void
    {
        $this->visibility = $visibility;
    }

    /**
     * @var string
     *
     * @ORM\Column(type="text"))
     */
    private $description = '';

    /**
     * @var bool
     * @ORM\Column(type="boolean", options={"default" = false}))
     */
    private $isSource = false;

    /**
     * @var int
     * @ORM\Column(type="integer", options={"default" = 0}))
     */
    private $sorting = 0;

    /**
     * @var Collection
     *
     * @ORM\ManyToOne(targetEntity="Collection", inversedBy="children")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="CASCADE")
     * })
     */
    private $parent;

    /**
     * @var DoctrineCollection
     *
     * @ORM\OneToMany(targetEntity="Collection", mappedBy="parent")
     * @ORM\OrderBy({"name" = "ASC", "id" = "ASC"})
     */
    private $children;

    /**
     * @var DoctrineCollection
     *
     * @ORM\ManyToMany(targetEntity="Card", inversedBy="collections")
     */
    private $cards;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->children = new ArrayCollection();
        $this->cards = new ArrayCollection();
    }

    /**
     * Set description
     *
     * @param string $description
     */
    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * Returns whether the collection is a source ("main" collection)
     */
    public function isSource(): bool
    {
        return $this->isSource;
    }

    /**
     * Set whether the collection is a source ("main" collection)
     *
     * @param bool $isSource
     */
    public function setIsSource(bool $isSource): void
    {
        $this->isSource = $isSource;
    }

    /**
     * Get the parent collection containing this collection.
     *
     * @return null|Collection
     */
    public function getParent(): ?self
    {
        return $this->parent;
    }

    /**
     * Set the parent collection containing this collection.
     *
     * @param null|Collection $parent
     */
    public function setParent(?self $parent): void
    {
        // Remove from previous parent
        if ($this->parent) {
            $this->parent->children->removeElement($this);
        }

        // Add to new parent
        if ($parent) {
            $this->assertNotCyclic($parent);
            $parent->children->add($this);
        }

        $this->parent = $parent;
    }

    private function assertNotCyclic(self $parentCandidate): void
    {
        $allChildren = $this->getAllChildren();

        while ($parentCandidate) {
            if (in_array($parentCandidate, $allChildren, true)) {
                throw new InvalidArgumentException('Parent collection is invalid because it would create a cyclic hierarchy');
            }

            $parentCandidate = $parentCandidate->getParent();
        }
    }

    /**
     * Get children collections
     *
     * @API\Field(type="Collection[]")
     *
     * @return DoctrineCollection
     */
    public function getChildren(): DoctrineCollection
    {
        return $this->children;
    }

    /**
     * Get recursively all children and grand-children
     *
     * @return Collection[]
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
     * Add card
     *
     * @param Card $card
     */
    public function addCard(Card $card): void
    {
        if (!$this->cards->contains($card)) {
            $this->cards[] = $card;
            $card->collectionAdded($this);
        }
    }

    /**
     * Remove card
     *
     * @param Card $card
     */
    public function removeCard(Card $card): void
    {
        $this->cards->removeElement($card);
        $card->collectionRemoved($this);
    }

    /**
     * Get cards
     *
     * @API\Field(type="Card[]")
     *
     * @return DoctrineCollection
     */
    public function getCards(): DoctrineCollection
    {
        return $this->cards;
    }

    /**
     * Get sorting value
     *
     * @return int
     */
    public function getSorting(): int
    {
        return $this->sorting;
    }

    /**
     * Set sorting value
     *
     * @param int $sorting
     */
    public function setSorting(int $sorting): void
    {
        $this->sorting = $sorting;
    }
}
