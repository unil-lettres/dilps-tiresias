<?php

declare(strict_types=1);

namespace Application\Acl\Assertion;

use Application\Enum\CollectionVisibility;
use Application\Model\Card;
use Application\Model\Collection;
use Ecodev\Felix\Acl\Assertion\NamedAssertion;
use Ecodev\Felix\Acl\ModelResource;
use Laminas\Permissions\Acl\Acl;
use Laminas\Permissions\Acl\Resource\ResourceInterface;
use Laminas\Permissions\Acl\Role\RoleInterface;

class Visibility implements NamedAssertion
{
    /**
     * @var string[]
     */
    private readonly array $allowedVisibilitiesValues;

    public function getName(): string
    {
        return 'la visibilité est ' . implode(' ou ', $this->allowedVisibilitiesValues);
    }

    /**
     * @param CollectionVisibility[] $allowedVisibilities
     */
    public function __construct(private readonly array $allowedVisibilities)
    {
        $this->allowedVisibilitiesValues = array_map(fn (CollectionVisibility $type) => $type->value, $this->allowedVisibilities);
    }

    /**
     * Assert that the object is the given visibility,
     * or belongs to the current user,
     * or has been created by the current user.
     *
     * @param \Application\Acl\Acl $acl
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
