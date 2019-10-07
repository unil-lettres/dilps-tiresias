<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\Card;
use Application\Model\Change;
use GraphQL\Type\Definition\Type;

class SuggestCreation implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'suggestCreation',
            'type' => Type::nonNull(_types()->getOutput(Change::class)),
            'description' => 'Suggest the creation of a new image',
            'args' => [
                'id' => Type::nonNull(_types()->getId(Card::class)),
                'request' => Type::nonNull(Type::string()),
            ],
            'resolve' => function (string $site, array $args): Change {
                $suggestion = $args['id']->getEntity();
                $change = _em()->getRepository(Change::class)->getOrCreate(Change::TYPE_CREATE, $suggestion, $args['request']);

                Helper::throwIfDenied($change, 'create');

                if (!$change->getId()) {
                    _em()->flush();
                }

                return $change;
            },
        ];
    }
}
