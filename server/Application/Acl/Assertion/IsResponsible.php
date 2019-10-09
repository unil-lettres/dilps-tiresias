<?php

declare(strict_types=1);

namespace Application\Acl\Assertion;

use Application\Model\User;
use Zend\Permissions\Acl\Acl;
use Zend\Permissions\Acl\Assertion\AssertionInterface;
use Zend\Permissions\Acl\Resource\ResourceInterface;
use Zend\Permissions\Acl\Role\RoleInterface;

class IsResponsible implements AssertionInterface
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
     * Assert that the object has explicit relation on user
     * or is the given visibility,
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
        $isVisible = new Visibility($this->allowedVisibilities);

        return in_array(User::getCurrent(), $object->getUsers()->toArray(), true) || $isVisible->assert($acl, $role, $resource, $privilege);
    }
}
