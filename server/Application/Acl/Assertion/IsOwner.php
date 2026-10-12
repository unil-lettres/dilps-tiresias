<?php

declare(strict_types=1);

namespace Application\Acl\Assertion;

use Application\Model\AbstractModel;
use Application\Model\User;
use Ecodev\Felix\Acl\Assertion\NamedAssertion;
use Ecodev\Felix\Acl\ModelResource;
use Laminas\Permissions\Acl\Acl;
use Laminas\Permissions\Acl\Resource\ResourceInterface;
use Laminas\Permissions\Acl\Role\RoleInterface;

/**
 * Assert that the current user is the owner (or creator) of the object.
 *
 * Contrary to IsOwnerOrResponsible, being a responsible (responsible) of a collection is **not** enough:
 * this is reserved to the actual owner, e.g. to change a collection settings or delete it.
 */
class IsOwner implements NamedAssertion
{
    public function getName(): string
    {
        return "l'objet m'appartient";
    }

    /**
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

        $user = User::getCurrent();
        if (!$user) {
            return $acl->reject('it is not himself');
        }

        if ($user === $object->getOwner() || $user === $object->getCreator()) {
            return true;
        }

        return $acl->reject('it is not the owner');
    }
}
