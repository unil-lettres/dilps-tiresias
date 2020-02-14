<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\Card;
use Application\Model\Collection;
use GraphQL\Type\Definition\Type;

/**
 * Custom implementation to have an optional collection
 */
class CreateCard implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'createCard',
            'type' => Type::nonNull(_types()->getOutput(Card::class)),
            'description' => 'Create a new card',
            'args' => [
                'input' => Type::nonNull(_types()->getInput(Card::class)),
                'collection' => _types()->getId(Collection::class),
            ],
            'resolve' => function (string $site, array $args): Card {
                // Check ACL
                $object = new Card();

                // Be sure that site is set first
                $input = $args['input'];
                Helper::hydrate($object, ['site' => $input['site']]);

                // Check ACL
                Helper::throwIfDenied($object, 'create');

                // Do it
                Helper::hydrate($object, $input);

                // Affect optional collection
                if ($args['collection'] ?? false) {
                    /** @var Collection $collection */
                    $collection = $args['collection']->getEntity();
                    Helper::throwIfDenied($collection, 'update');

                    $collection->addCard($object);
                }

                _em()->persist($object);
                _em()->flush();

                return $object;
            },
        ];
    }
}
