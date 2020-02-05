<?php

declare(strict_types=1);

namespace Application\Api\Output;

use Application\DBAL\Types\SiteType;
use Application\Model\User;
use GraphQL\Type\Definition\ObjectType;

class GlobalPermissionsListType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'name' => 'GlobalPermissionsList',
            'description' => 'Describe permissions for current user',
            'fields' => function (): array {
                $user = User::getCurrent();

                // Simulate a user in the very rare case when there is none (when dumping GraphQL schema)
                if (!$user) {
                    $user = new User();
                    $user->setSite(SiteType::DILPS);
                }

                $globalPermissions = $user->getGlobalPermissions();

                $fields = [];
                foreach ($globalPermissions as $class => $perm) {
                    $fields[$class] = [
                        'type' => _types()->get(GlobalPermissionsType::class),
                    ];
                }

                return $fields;
            },
        ];

        parent::__construct($config);
    }
}
