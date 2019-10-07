<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Model\User;
use GraphQL\Type\Definition\Type;
use Zend\Expressive\Session\SessionInterface;

abstract class Logout implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'logout',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Log out a user',
            'resolve' => function (string $site, array $args, SessionInterface $session): bool {

                // Logout
                $session->clear();
                User::setCurrent(null);

                return true;
            },
        ];
    }
}
