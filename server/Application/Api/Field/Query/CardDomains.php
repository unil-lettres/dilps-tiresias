<?php

declare(strict_types=1);

namespace Application\Api\Field\Query;

use Application\Model\Card;
use Application\Model\Domain;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;

abstract class CardDomains implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'cardDomains' => fn () => [
            'type' => Type::nonNull(Type::listOf(Type::nonNull(_types()->getOutput(Domain::class)))),
            'args' => [
                [
                    'name' => 'filter',
                    'type' => _types()->getFilter(Card::class),
                ],
            ],
            'description' => 'List domains sorted by usage on cards filtered by given variables',
            'resolve' => function ($root, array $args): array {
                $qb = _types()->createFilteredQueryBuilder(Card::class, $args['filter'], []);

                return _em()->getRepository(Domain::class)->getByCards($qb);
            },
        ];
    }
}
