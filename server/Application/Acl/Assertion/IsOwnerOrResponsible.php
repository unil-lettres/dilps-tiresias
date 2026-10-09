<?php

declare(strict_types=1);

namespace Application\Acl\Assertion;

use Application\Enum\CollectionVisibility;
use Application\Model\AbstractModel;
use Application\Model\Card;
use Application\Model\Change;
use Application\Model\Collection;
use Application\Model\User;
use Ecodev\Felix\Acl\Assertion\NamedAssertion;
use Ecodev\Felix\Acl\ModelResource;
use Laminas\Permissions\Acl\Acl;
use Laminas\Permissions\Acl\Resource\ResourceInterface;
use Laminas\Permissions\Acl\Role\RoleInterface;

class IsOwnerOrResponsible implements NamedAssertion
{
    /**
     * @param null|CollectionVisibility[] $collectionVisibilities if given, owning or being responsible of a collection
     *                                                             only counts for collections with one of these visibilities
     */
    public function __construct(
        private readonly ?array $collectionVisibilities = null,
    ) {}

    public function getName(): string
    {
        if ($this->collectionVisibilities === null) {
            return "l'objet m'appartient ou j'en suis responsable";
        }

        return "l'objet m'appartient ou j'en suis responsable via une collection dont la visibilité est " . $this->getVisibilitiesList('ou');
    }

    /**
     * Assert that the object belongs to the current user, or belong to a collection that the user owns or is responsible of.
     *
     * The owner of a collection has at least the same rights as its responsibles on the objects it contains.
     *
     * @param \Application\Acl\Acl $acl
     * @param ModelResource $resource
     * @param string $privilege
     *
     * @return bool
     */
    public function assert(Acl $acl, ?RoleInterface $role = null, ?ResourceInterface $resource = null, $privilege = null)
    {
        /** @var AbstractModel $object */
        $object = $resource->getInstance();

        // Without user no chance to be the owner
        if (!User::getCurrent()) {
            return $acl->reject('it is not himself');
        }

        if (User::getCurrent() === $object->getOwner()) {
            return true;
        }

        // If not direct owner, look for a collection that the user owns or is responsible of
        /** @var Collection[] $collections */
        $collections = [];
        if ($object instanceof Collection) {
            $collections = [$object];
        } elseif ($object instanceof Card) {
            $collections = $object->getCollections();
        } elseif ($object instanceof Change) {
            $original = $object->getOriginal();
            if ($original) {
                $collections = $original->getCollections()->toArray();
            }

            $suggestion = $object->getSuggestion();
            if ($suggestion) {
                $collections = array_merge($collections, $suggestion->getCollections()->toArray());
            }
        }

        foreach ($collections as $collection) {
            if ($this->collectionVisibilities !== null && !in_array($collection->getVisibility(), $this->collectionVisibilities, true)) {
                continue;
            }

            if ($collection->getOwner() === User::getCurrent() || $collection->getResponsibles()->contains(User::getCurrent())) {
                return true;
            }
        }

        if ($this->collectionVisibilities !== null) {
            return $acl->reject('it is not the owner, nor one of the responsible of a collection with visibility ' . $this->getVisibilitiesList('or'));
        }

        return $acl->reject('it is not the owner, nor one of the responsible');
    }

    private function getVisibilitiesList(string $separator): string
    {
        return implode(' ' . $separator . ' ', array_map(fn (CollectionVisibility $visibility) => $visibility->value, $this->collectionVisibilities ?? []));
    }
}
