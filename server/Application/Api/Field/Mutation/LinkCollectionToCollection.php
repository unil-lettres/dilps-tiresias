<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\Collection;
use GraphQL\Type\Definition\Type;

class LinkCollectionToCollection implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'linkCollectionToCollection',
            'type' => Type::nonNull(_types()->getOutput(Collection::class)),
            'description' => 'This will link all images from the source collection to the target collection. The returned collection is the target',
            'args' => [
                'sourceCollection' => Type::nonNull(_types()->getId(Collection::class)),
                'targetCollection' => Type::nonNull(_types()->getId(Collection::class)),
            ],
            'resolve' => function (string $site, array $args): Collection {
                $sourceCollection = $args['sourceCollection']->getEntity();
                $targetCollection = $args['targetCollection']->getEntity();

                Helper::throwIfDenied($targetCollection, 'update');

                _em()->getRepository(Collection::class)->linkCollectionToCollection($sourceCollection, $targetCollection);

                return $targetCollection;
            },
        ];
    }
}
