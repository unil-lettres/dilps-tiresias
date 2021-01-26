<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\Model\Collection;
use Application\Repository\CollectionRepository;
use Ecodev\Felix\Api\Field\FieldInterface;
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
            'resolve' => function (array $root, array $args): Collection {
                $sourceCollection = $args['sourceCollection']->getEntity();
                $targetCollection = $args['targetCollection']->getEntity();

                Helper::throwIfDenied($targetCollection, 'update');

                /** @var CollectionRepository $collectionRepository */
                $collectionRepository = _em()->getRepository(Collection::class);
                $collectionRepository->linkCollectionToCollection($sourceCollection, $targetCollection);

                return $targetCollection;
            },
        ];
    }
}
