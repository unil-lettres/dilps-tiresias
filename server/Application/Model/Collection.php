<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasInstitution;
use Application\Traits\HasParent;
use Application\Traits\HasParentInterface;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Application\Traits\HasSorting;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection as DoctrineCollection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;
use GraphQL\Doctrine\Annotation as API;

/**
 * A collection of cards
 *
 * @ORM\Entity(repositoryClass="Application\Repository\CollectionRepository")
 * @ORM\Table(indexes={@ORM\Index(name="collection_name_idx", columns={"name"})})
 */
class Collection extends AbstractModel implements HasParentInterface, HasSiteInterface
{
    use HasName;
    use HasInstitution;
    use HasSorting;
    use HasParent;
    use HasSite;

    public const VISIBILITY_PRIVATE = 'private';
    public const VISIBILITY_ADMINISTRATOR = 'administrator';
    public const VISIBILITY_MEMBER = 'member';

    /**
     * @var string
     * @ORM\Column(type="CollectionVisibility", options={"default" = Collection::VISIBILITY_PRIVATE})
     */
    private $visibility = self::VISIBILITY_PRIVATE;

    /**
     * @var string
     *
     * @ORM\Column(type="text")
     */
    private $description = '';

    /**
     * @var bool
     * @ORM\Column(type="boolean", options={"default" = false})
     */
    private $isSource = false;

    /**
     * @var string
     * @ORM\Column(type="string", length=191)
     */
    private $copyrights = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=191)
     */
    private $usageRights = '';

    /**
     * @var null|Collection
     *
     * @ORM\ManyToOne(targetEntity="Collection", inversedBy="children")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="CASCADE")
     * })
     */
    private $parent;

    /**
     * @var DoctrineCollection<Collection>
     *
     * @ORM\OneToMany(targetEntity="Collection", mappedBy="parent")
     * @ORM\OrderBy({"name" = "ASC", "id" = "ASC"})
     */
    private $children;

    /**
     * @var DoctrineCollection<User>
     * @ORM\ManyToMany(targetEntity="User", inversedBy="collections")
     */
    private $users;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->children = new ArrayCollection();
        $this->users = new ArrayCollection();
    }

    /**
     * Return whether this is publicly available to only to member, or only administrators, or only owner
     *
     * @API\Field(type="Application\Api\Enum\CollectionVisibilityType")
     */
    public function getVisibility(): string
    {
        return $this->visibility;
    }

    /**
     * Set whether this is publicly available to only to member, or only administrators, or only owner
     *
     * @API\Input(type="Application\Api\Enum\CollectionVisibilityType")
     */
    public function setVisibility(string $visibility): void
    {
        $this->visibility = $visibility;
    }

    /**
     * Set description
     */
    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    /**
     * Get description
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
     */
    public function setIsSource(bool $isSource): void
    {
        $this->isSource = $isSource;
    }

    /**
     * Set copyrights
     */
    public function setCopyrights(string $copyrights): void
    {
        $this->copyrights = $copyrights;
    }

    /**
     * Get copyrights
     */
    public function getCopyrights(): string
    {
        return $this->copyrights;
    }

    /**
     * Set usageRights
     *
     * @param string $usageRights
     */
    public function setUsageRights($usageRights): void
    {
        $this->usageRights = $usageRights;
    }

    /**
     * Get usageRights
     */
    public function getUsageRights(): string
    {
        return $this->usageRights;
    }

    /**
     * Get users
     *
     * @API\Field(type="User[]")
     */
    public function getUsers(): DoctrineCollection
    {
        return $this->users;
    }

    /**
     * Add User
     */
    public function addUser(User $user): void
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
        }
    }

    /**
     * Remove User
     */
    public function removeUser(User $user): void
    {
        $this->users->removeElement($user);
    }

    public function hasUsers(): bool
    {
        return count($this->users) > 0;
    }
}
