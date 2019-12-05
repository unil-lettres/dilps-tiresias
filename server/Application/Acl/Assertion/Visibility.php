<?php

declare(strict_types=1);

namespace Application\Acl\Assertion;

use Zend\Permissions\Acl\Acl;
use Zend\Permissions\Acl\Assertion\AssertionInterface;
use Zend\Permissions\Acl\Resource\ResourceInterface;
use Zend\Permissions\Acl\Role\RoleInterface;

class Visibility implements AssertionInterface
{
    /**
     * @var string[]
     */
    private $allowedVisibilities;

    public function __construct(array $visibilities)
    {
        $this->allowedVisibilities = $visibilities;
    }

    /**
     * Assert that the object is the given visibility,
     * or belongs to the current user,
     * or has been created by the current user.
     *
     * @param Acl $acl
     * @param RoleInterface $role
     * @param ResourceInterface $resource
     * @param string $privilege
     *
     * @return bool
     */
    public function assert(Acl $acl, RoleInterface $role = null, ResourceInterface $resource = null, $privilege = null)
    {
        $object = $resource->getInstance();

        return in_array($object->getVisibility(), $this->allowedVisibilities, true);
    }
}
