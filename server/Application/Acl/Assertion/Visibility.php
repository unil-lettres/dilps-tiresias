<?php

declare(strict_types=1);

namespace Application\Acl\Assertion;

use Application\Model\Card;
use Application\Model\Collection;
use Ecodev\Felix\Acl\ModelResource;
use Laminas\Permissions\Acl\Acl;
use Laminas\Permissions\Acl\Assertion\AssertionInterface;
use Laminas\Permissions\Acl\Resource\ResourceInterface;
use Laminas\Permissions\Acl\Role\RoleInterface;

class Visibility implements AssertionInterface
{
    /**
     * @var string[]
     */
    private array $allowedVisibilities;

    public function __construct(array $visibilities)
    {
        $this->allowedVisibilities = $visibilities;
    }

    /**
     * Assert that the object is the given visibility,
     * or belongs to the current user,
     * or has been created by the current user.
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
        /** @var Card|Collection $object */
        $object = $resource->getInstance();

        return in_array($object->getVisibility(), $this->allowedVisibilities, true);
    }
}
