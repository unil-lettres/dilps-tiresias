<?php

declare(strict_types=1);

namespace Application\Acl\Assertion;

use Application\Model\File;
use Ecodev\Felix\Acl\Assertion\NamedAssertion;
use Ecodev\Felix\Acl\ModelResource;
use Laminas\Permissions\Acl\Acl;
use Laminas\Permissions\Acl\Resource\ResourceInterface;
use Laminas\Permissions\Acl\Role\RoleInterface;

class CanUpdateCard implements NamedAssertion
{
    public function getName(): string
    {
        return 'je peux éditer la fiche';
    }

    /**
     * Assert that the card that the object belongs to can be updated.
     *
     * @param \Application\Acl\Acl $acl
     * @param ModelResource $resource
     * @param string $privilege
     *
     * @return bool
     */
    public function assert(Acl $acl, ?RoleInterface $role = null, ?ResourceInterface $resource = null, $privilege = null)
    {
        /** @var File $object */
        $object = $resource->getInstance();
        $card = $object->getCard();

        return $acl->isCurrentUserAllowed($card, 'update');
    }
}
