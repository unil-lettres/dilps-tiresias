<?php

declare(strict_types=1);

namespace Application\Acl\Assertion;

use Application\Model\Card;
use Ecodev\Felix\Acl\ModelResource;
use Laminas\Permissions\Acl\Acl;
use Laminas\Permissions\Acl\Assertion\AssertionInterface;
use Laminas\Permissions\Acl\Resource\ResourceInterface;
use Laminas\Permissions\Acl\Role\RoleInterface;

class IsNotSuggestion implements AssertionInterface
{
    /**
     * Assert that the card is NOT a suggestion (has a change).
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
        /** @var Card $object */
        $object = $resource->getInstance();

        return !$object->getChange();
    }
}
