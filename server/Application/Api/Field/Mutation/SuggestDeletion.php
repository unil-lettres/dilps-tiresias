<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\Card;
use Application\Model\Change;
use GraphQL\Type\Definition\Type;

class SuggestDeletion implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'suggestDeletion',
            'type' => Type::nonNull(_types()->getOutput(Change::class)),
            'description' => 'Suggest the deletion of an existing image',
            'args' => [
                'id' => Type::nonNull(_types()->getId(Card::class)),
                'request' => Type::nonNull(Type::string()),
            ],
            'resolve' => function (string $site, array $args): Change {
                $original = $args['id']->getEntity();
                $change = _em()->getRepository(Change::class)->getOrCreate(Change::TYPE_DELETE, $original, $args['request']);

                Helper::throwIfDenied($change, 'create');

                if (!$change->getId()) {
                    _em()->flush();
                }

                return $change;
            },
        ];
    }
}
