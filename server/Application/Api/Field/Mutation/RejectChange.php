<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\Model\Change;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;

class RejectChange implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'rejectChange',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Reject the change',
            'args' => [
                'id' => Type::nonNull(_types()->getId(Change::class)),
            ],
            'resolve' => function (array $root, array $args): bool {
                /** @var Change $change */
                $change = $args['id']->getEntity();

                Helper::throwIfDenied($change, 'update');

                _em()->remove($change);
                _em()->flush();

                return true;
            },
        ];
    }
}
