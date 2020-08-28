<?php

declare(strict_types=1);

namespace Application\Api\Field\Query;

use Application\Api\Field\FieldInterface;
use Application\Model\User;

abstract class Viewer implements FieldInterface
{
    public static function build(): array
    {
        return
            [
                'name' => 'viewer',
                'type' => _types()->getOutput(User::class),
                'description' => 'Represents currently logged-in user',
                'resolve' => function (string $site, array $args): ?User {
                    return User::getCurrent();
                },
            ];
    }
}
