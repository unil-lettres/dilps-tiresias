<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Model\Collection;
use Application\Model\User;
use Ecodev\Felix\Api\Exception;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;

class UnsubscribeCollection implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'unsubscribeCollection' => fn () => [
            'type' => Type::nonNull(_types()->getOutput(Collection::class)),
            'description' => 'Remove the current user from the collection, as a responsible and/or a subscriber. '
                . 'This allows any member to leave a collection on their own, without needing any privilege on it.',
            'args' => [
                'collection' => Type::nonNull(_types()->getId(Collection::class)),
            ],
            'resolve' => function ($root, array $args): Collection {
                /** @var Collection $collection */
                $collection = $args['collection']->getEntity();

                $user = User::getCurrent();
                if (!$user) {
                    throw new Exception('Must be logged in to unsubscribe from a collection');
                }

                $collection->removeResponsible($user);
                $collection->removeSubscriber($user);
                _em()->flush();

                return $collection;
            },
        ];
    }
}
