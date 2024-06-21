<?php

declare(strict_types=1);

namespace Application\Api\Field\Query;

use Application\Model\Card;
use Application\Model\Collection;
use Application\Repository\CollectionRepository;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;

abstract class CollectionCopyrights implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'collectionCopyrights' => fn () => [
            'type' => Type::nonNull(Type::string()),
            'description' => 'Returns the copyrights of given card',
            'args' => [
                'card' => Type::nonNull(_types()->getId(Card::class)),
            ],
            'resolve' => function ($root, array $args): string {
                $card = $args['card']->getEntity();

                /** @var CollectionRepository $collectionRepository */
                $collectionRepository = _em()->getRepository(Collection::class);

                return $collectionRepository->getCopyrights($card);
            },
        ];
    }
}
