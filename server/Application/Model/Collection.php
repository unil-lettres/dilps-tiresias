<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Api\Enum\CollectionVisibilityType;
use Application\Api\Input\Operator\ExcludeSelfAndDescendantsOperatorType;
use Application\Repository\CollectionRepository;
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
use GraphQL\Doctrine\Attribute as API;

/**
 * A collection of cards.
 */
#[ORM\Index(name: 'collection_name_idx', columns: ['name'])]
#[API\Filter(field: 'custom', operator: ExcludeSelfAndDescendantsOperatorType::class, type: 'id')]
#[ORM\Entity(CollectionRepository::class)]
class Collection extends AbstractModel implements HasParentInterface, HasSiteInterface
{
    use HasInstitution;
    use HasName;
    use HasParent;
    use HasSite;
    use HasSorting;

    final public const VISIBILITY_PRIVATE = 'private';
    final public const VISIBILITY_ADMINISTRATOR = 'administrator';
    final public const VISIBILITY_MEMBER = 'member';

    #[ORM\Column(type: 'CollectionVisibility', options: ['default' => self::VISIBILITY_PRIVATE])]
    private string $visibility = self::VISIBILITY_PRIVATE;

    #[ORM\Column(type: 'text')]
    private string $description = '';

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private bool $isSource = false;

    #[ORM\Column(type: 'string', length: 191)]
    private string $copyrights = '';

    #[ORM\Column(type: 'string', length: 191)]
    private string $usageRights = '';

    /**
     * @var null|Collection
     */
    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    private $parent;

    /**
     * @var DoctrineCollection<Collection>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'parent')]
    #[ORM\OrderBy(['name' => 'ASC', 'id' => 'ASC'])]
    private $children;

    /**
     * @var DoctrineCollection<User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'collections')]
    private DoctrineCollection $users;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->children = new ArrayCollection();
        $this->users = new ArrayCollection();
    }

    /**
     * Return whether this is publicly available to only to member, or only administrators, or only owner.
     */
    #[API\Field(type: CollectionVisibilityType::class)]
    public function getVisibility(): string
    {
        return $this->visibility;
    }

    /**
     * Set whether this is publicly available to only to member, or only administrators, or only owner.
     */
    #[API\Input(type: CollectionVisibilityType::class)]
    public function setVisibility(string $visibility): void
    {
        $this->visibility = $visibility;
    }

    /**
     * Set description.
     */
    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    /**
     * Get description.
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * Returns whether the collection is a source ("main" collection).
     */
    public function isSource(): bool
    {
        return $this->isSource;
    }

    /**
     * Set whether the collection is a source ("main" collection).
     */
    public function setIsSource(bool $isSource): void
    {
        $this->isSource = $isSource;
    }

    /**
     * Set copyrights.
     */
    public function setCopyrights(string $copyrights): void
    {
        $this->copyrights = $copyrights;
    }

    /**
     * Get copyrights.
     */
    public function getCopyrights(): string
    {
        return $this->copyrights;
    }

    /**
     * Set usageRights.
     *
     * @param string $usageRights
     */
    public function setUsageRights($usageRights): void
    {
        $this->usageRights = $usageRights;
    }

    /**
     * Get usageRights.
     */
    public function getUsageRights(): string
    {
        return $this->usageRights;
    }

    /**
     * Get users.
     */
    public function getUsers(): DoctrineCollection
    {
        return $this->users;
    }

    /**
     * Add User.
     */
    public function addUser(User $user): void
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
        }
    }

    /**
     * Remove User.
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
