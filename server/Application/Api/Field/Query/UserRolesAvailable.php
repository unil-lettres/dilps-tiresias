<?php

declare(strict_types=1);

namespace Application\Api\Field\Query;

use Application\Api\Enum\UserRoleType;
use Application\Model\User;
use Application\Service\Role;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;

abstract class UserRolesAvailable implements FieldInterface
{
    public static function build(): array
    {
        return
            [
                'name' => 'userRolesAvailable',
                'type' => Type::nonNull(Type::listOf(Type::nonNull(_types()->get(UserRoleType::class)))),
                'description' => 'List of roles available for the given user',
                'args' => [
                    [
                        'name' => 'user',
                        'type' => _types()->getId(User::class),
                    ],
                ],
                'resolve' => function ($root, array $args): array {
                    $currentUser = User::getCurrent();
                    $oldRole = isset($args['user']) ? $args['user']->getEntity()->getRole() : User::ROLE_STUDENT;

                    /** @var UserRoleType $type */
                    $type = _types()->get(UserRoleType::class);

                    // Check each roles that exist in our API (which is different from the roles that exist in our DB)
                    $available = [];
                    foreach ($type->getValues() as $valueDefinition) {
                        $newRole = $valueDefinition->value;
                        if (Role::canUpdate($currentUser, $oldRole, $newRole)) {
                            $available[] = $newRole;
                        }
                    }

                    return $available;
                },
            ];
    }
}
