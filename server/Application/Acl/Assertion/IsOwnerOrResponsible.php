<?php

declare(strict_types=1);

namespace Application\Acl\Assertion;

use Application\Model\AbstractModel;
use Application\Model\Card;
use Application\Model\Change;
use Application\Model\Collection;
use Application\Model\User;
use Ecodev\Felix\Acl\ModelResource;
use Laminas\Permissions\Acl\Acl;
use Laminas\Permissions\Acl\Assertion\AssertionInterface;
use Laminas\Permissions\Acl\Resource\ResourceInterface;
use Laminas\Permissions\Acl\Role\RoleInterface;

class IsOwnerOrResponsible implements AssertionInterface
{
    /**
     * Assert that the object belongs to the current user, or belong to a collection that the user is responsible of
     *
     * @param \Application\Acl\Acl $acl
     * @param RoleInterface $role
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

        // If not direct owner, look for indirect collection responsible
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
            if ($collection->getUsers()->contains(User::getCurrent())) {
                return true;
            }
        }

        return $acl->reject('it is not the owner, nor one of the responsible');
    }
}
