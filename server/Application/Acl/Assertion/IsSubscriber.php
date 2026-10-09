<?php

declare(strict_types=1);

namespace Application\Acl\Assertion;

use Application\Model\Collection;
use Application\Model\User;
use Ecodev\Felix\Acl\Assertion\NamedAssertion;
use Ecodev\Felix\Acl\ModelResource;
use Laminas\Permissions\Acl\Acl;
use Laminas\Permissions\Acl\Resource\ResourceInterface;
use Laminas\Permissions\Acl\Role\RoleInterface;

/**
 * Assert that the current user is a subscriber (reader) of the collection.
 */
class IsSubscriber implements NamedAssertion
{
    public function getName(): string
    {
        return 'je suis lecteur de la collection';
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
        /** @var Collection $collection */
        $collection = $resource->getInstance();

        $user = User::getCurrent();
        if ($user && $collection->getSubscribers()->contains($user)) {
            return true;
        }

        return $acl->reject('it is not one of the subscribers');
    }
}
