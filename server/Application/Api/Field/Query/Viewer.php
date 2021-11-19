<?php

declare(strict_types=1);

namespace Application\Api\Field\Query;

use Application\Model\User;
use Ecodev\Felix\Api\Field\FieldInterface;

abstract class Viewer implements FieldInterface
{
    public static function build(): array
    {
        return
            [
                'name' => 'viewer',
                'type' => _types()->getOutput(User::class),
                'description' => 'Represents currently logged-in user',
                'resolve' => fn (array $root, array $args): ?User => User::getCurrent(),
            ];
    }
}
