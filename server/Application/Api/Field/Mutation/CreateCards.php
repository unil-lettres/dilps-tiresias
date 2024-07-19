<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\Model\Card;
use Application\Model\Collection;
use Application\Service\Importer;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;

class CreateCards implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'createCards' => fn () => [
            'type' => Type::nonNull(Type::listOf(Type::nonNull(_types()->getOutput(Card::class)))),
            'description' => 'Create multiple cards from an excel files and several images',
            'args' => [
                'excel' => Type::nonNull(_types()->get('Upload')),
                'images' => Type::nonNull(Type::listOf(Type::nonNull(_types()->get('Upload')))),
                'collection' => _types()->getId(Collection::class),
            ],
            'resolve' => function ($root, array $args): array {
                $site = $root['site'];

                // Check ACL
                $object = new Card();
                $object->setSite($site);
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
