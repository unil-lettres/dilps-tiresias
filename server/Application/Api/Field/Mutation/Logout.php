<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Model\User;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;
use Mezzio\Session\SessionInterface;

abstract class Logout implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'logout' => fn () => [
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Log out a user',
            'resolve' => function ($root, array $args, SessionInterface $session): bool {
                // Logout
                $session->clear();
                User::setCurrent(null);

                return true;
            },
        ];
    }
}
