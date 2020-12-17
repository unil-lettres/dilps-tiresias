<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\Model\Card;
use Application\Model\Export;
use Application\Repository\ExportRepository;
use Ecodev\Felix\Api\Field\FieldInterface;
use Ecodev\Felix\Utility;
use GraphQL\Type\Definition\Type;

/**
 * Custom implementation to inject lots of cards via collection without loading each cards
 */
class CreateExport implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'createExport',
            'type' => Type::nonNull(_types()->getOutput(Export::class)),
            'description' => 'Create a new export',
            'args' => [
                'input' => Type::nonNull(_types()->getInput(Export::class)),
                'cards' => Type::nonNull(Type::listOf(Type::nonNull(_types()->getId(Card::class)))),
            ],
            'resolve' => function (array $root, array $args): Export {
                // Check ACL
                $object = new Export();

                // Be sure that site is set first
                $input = $args['input'];
                Helper::hydrate($object, ['site' => $input['site']]);

                // Check ACL
                Helper::throwIfDenied($object, 'create');

                // Do it
                Helper::hydrate($object, $input);

                _em()->persist($object);
                _em()->flush();

                // Actually inject all selected cards into export (either hand-picked or via collection)
                $cardIds = Utility::modelToId($args['cards']);
                /** @var ExportRepository $exportRepository */
                $exportRepository = _em()->getRepository(Export::class);
                $cardCount = $exportRepository->updateCards($object, $cardIds);

                if ($cardCount < 200) {
                    // TODO export now
                } else {
                    // TODO export async
                    $a = 1;
                }

                return $object;
            },
        ];
    }
}
