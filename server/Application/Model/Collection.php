<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Acl\Acl;
use Application\Api\Helper;
use Application\Api\Input\Operator\ExcludeSelfAndDescendantsOperatorType;
use Application\Enum\CollectionVisibility;
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
use Ecodev\Felix\Api\Exception;
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
    use HasParent {
        setParent as private setParentWithoutCheck;
    }
    use HasSite;
    use HasSorting;

    #[ORM\Column(type: 'enum', options: ['default' => CollectionVisibility::Private])]
    private CollectionVisibility $visibility = CollectionVisibility::Private;

    #[ORM\Column(type: 'text')]
    private string $description = '';

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private bool $isSource = false;

    #[ORM\Column(type: 'string', length: 191)]
    private string $copyrights = '';

    #[ORM\Column(type: 'string', length: 191)]
    private string $usageRights = '';

    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    private ?self $parent = null;

    /**
     * @var DoctrineCollection<Collection>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'parent')]
    #[ORM\OrderBy(['name' => 'ASC', 'id' => 'ASC'])]
    private DoctrineCollection $children;

    /**
     * Users responsible for the collection: they curate its cards/images and manage its subscribers,
     * but cannot change the collection settings nor delete it (that is reserved to the owner).
     *
     * @var DoctrineCollection<User>
     */
    #[ORM\JoinTable(name: 'collection_responsible')]
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'responsibleCollections')]
    private DoctrineCollection $responsibles;

    /**
     * Users who subscribed to the collection: they have read-only access and can only unsubscribe themselves.
     *
     * @var DoctrineCollection<User>
     */
    #[ORM\JoinTable(name: 'collection_subscriber')]
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'subscribedCollections')]
    private DoctrineCollection $subscribers;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private bool $isHistoric = false;

    public function __construct()
    {
        $this->children = new ArrayCollection();
        $this->responsibles = new ArrayCollection();
        $this->subscribers = new ArrayCollection();
    }

    /**
     * Set the parent collection.
     *
     * Putting a collection inside another one adds content to that parent, so it requires the same right as adding
     * images to it: being its owner or one of its responsibles.
     */
    public function setParent(?self $parent): void
    {
        // Without a logged-in user (CLI, unit tests) there is nobody to check, and anonymous cannot reach this via the API
        if (User::getCurrent() && $parent && $parent !== $this->getParent()) {
            Helper::throwIfDenied($parent, 'linkCard');
        }

        $this->setParentWithoutCheck($parent);
    }

    /**
     * Return whether this is publicly available to only to member, or only administrators, or only owner.
     */
    public function getVisibility(): CollectionVisibility
    {
        return $this->visibility;
    }

    /**
     * Set whether this is publicly available to only to member, or only administrators, or only owner.
     */
    public function setVisibility(CollectionVisibility $visibility): void
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
     * Get responsibles.
     */
    public function getResponsibles(): DoctrineCollection
    {
        return $this->responsibles;
    }

    /**
     * Add a responsible.
     *
     * A user cannot be a responsible and a subscriber at the same time, so any existing subscription is removed.
     */
    public function addResponsible(User $user): void
    {
        $this->removeSubscriber($user);

        if (!$this->responsibles->contains($user)) {
            $this->responsibles[] = $user;
        }
    }

    /**
     * Remove a responsible.
     */
    public function removeResponsible(User $user): void
    {
        $this->responsibles->removeElement($user);
    }

    public function getResponsiblesCount(): int
    {
        return count($this->responsibles);
    }

    /**
     * Get subscribers.
     */
    public function getSubscribers(): DoctrineCollection
    {
        return $this->subscribers;
    }

    /**
     * Add a subscriber.
     *
     * A user cannot be a subscriber and a responsible at the same time. But responsibles may add subscribers, so this
     * must not demote an existing responsible: that is reserved to the owner, by removing them from the responsibles.
     */
    public function addSubscriber(User $user): void
    {
        if ($this->responsibles->contains($user)) {
            throw new Exception("Cet utilisateur est déjà responsable de la collection. Pour en faire un lecteur, retirez-le d'abord des responsables.");
        }

        if (!$this->subscribers->contains($user)) {
            $this->subscribers[] = $user;
        }
    }

    /**
     * Remove a subscriber.
     */
    public function removeSubscriber(User $user): void
    {
        $this->subscribers->removeElement($user);
    }

    public function getSubscribersCount(): int
    {
        return count($this->subscribers);
    }

    /**
     * Returns whether the collection is historic (shows icon).
     */
    public function isHistoric(): bool
    {
        return $this->isHistoric;
    }

    /**
     * Set whether the collection is historic (shows icon).
     */
    public function setIsHistoric(bool $isHistoric): void
    {
        $this->isHistoric = $isHistoric;
    }

    /**
     * Return whether this collections is an historic collection.
     */
    public function getShowHistoric(): bool
    {
        return $this->isHistoric() && $this->isSource();
    }

    /**
     * Whether the current user is allowed to add or remove cards (images) of this collection.
     */
    #[API\Field]
    public function getCanManageContent(): bool
    {
        return new Acl()->isCurrentUserAllowed($this, 'linkCard');
    }

    /**
     * Whether the current user is allowed to add or remove responsibles of this collection.
     */
    #[API\Field]
    public function getCanManageResponsibles(): bool
    {
        return new Acl()->isCurrentUserAllowed($this, 'manageResponsibles');
    }

    /**
     * Whether the current user is allowed to add or remove subscribers of this collection.
     */
    #[API\Field]
    public function getCanManageSubscribers(): bool
    {
        return new Acl()->isCurrentUserAllowed($this, 'manageSubscribers');
    }

    /**
     * Whether the current user is a responsible of this collection.
     */
    #[API\Field]
    public function getViewerIsResponsible(): bool
    {
        $user = User::getCurrent();

        return $user !== null && $this->responsibles->contains($user);
    }

    /**
     * Whether the current user is a subscriber of this collection.
     */
    #[API\Field]
    public function getViewerIsSubscriber(): bool
    {
        $user = User::getCurrent();

        return $user !== null && $this->subscribers->contains($user);
    }
}
