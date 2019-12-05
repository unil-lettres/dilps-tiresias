<?php

declare(strict_types=1);

namespace Application\Acl\Assertion;

use Zend\Permissions\Acl\Acl;
use Zend\Permissions\Acl\Assertion\AssertionInterface;
use Zend\Permissions\Acl\Resource\ResourceInterface;
use Zend\Permissions\Acl\Role\RoleInterface;

class All implements AssertionInterface
{
    /**
     * @var AssertionInterface[]
     */
    private $asserts;

    /**
     * Check if all asserts are true
     *
     * @param AssertionInterface[] $asserts
     */
    public function __construct(AssertionInterface ...$asserts)
    {
        $this->asserts = $asserts;
    }

    /**
     * Assert that all given assert are correct (AND logic)
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
        foreach ($this->asserts as $assert) {
            if (!$assert->assert($acl, $role, $resource, $privilege)) {
                return false;
            }
        }

        return true;
    }
}
