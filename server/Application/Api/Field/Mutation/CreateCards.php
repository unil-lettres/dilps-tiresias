<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\Card;
use Application\Model\Collection;
use Application\Service\Importer;
use GraphQL\Type\Definition\Type;

class CreateCards implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'createCards',
            'type' => Type::nonNull(Type::listOf(Type::nonNull(_types()->getOutput(Card::class)))),
            'description' => 'Create multiple cards from an excel files and several images',
            'args' => [
                'excel' => Type::nonNull(_types()->get('Upload')),
                'images' => Type::nonNull(Type::listOf(Type::nonNull(_types()->get('Upload')))),
                'collection' => _types()->getId(Collection::class),
            ],
            'resolve' => function (string $site, array $args): array {
                // Check ACL
                $object = new Card();
                Helper::throwIfDenied($object, 'create');

                // Get optional collection
                if ($args['collection'] ?? false) {
                    $collection = $args['collection']->getEntity();
                    Helper::throwIfDenied($collection, 'update');
                } else {
                    $collection = null;
                }

                // Do it
                $excel = $args['excel'];
                $images = $args['images'];

                $importer = new Importer();
                $cards = $importer->import($excel, $images, $site, $collection);

                _em()->flush();

                return $cards;
            },
        ];
    }
}
