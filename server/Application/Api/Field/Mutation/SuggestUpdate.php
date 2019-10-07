<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Exception;
use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\Card;
use Application\Model\Change;
use GraphQL\Type\Definition\Type;

class SuggestUpdate implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'suggestUpdate',
            'type' => Type::nonNull(_types()->getOutput(Change::class)),
            'description' => 'Suggest the update of an existing image',
            'args' => [
                'id' => Type::nonNull(_types()->getId(Card::class)),
                'request' => Type::nonNull(Type::string()),
            ],
            'resolve' => function (string $site, array $args): Change {
                $suggestion = $args['id']->getEntity();
                $original = $suggestion->getOriginal();

                if (!$original) {
                    throw new Exception('An suggestion must have an original defined');
                }

                $change = _em()->getRepository(Change::class)->getOrCreate(Change::TYPE_UPDATE, $suggestion, $args['request']);
                Helper::throwIfDenied($change, 'create');

                if (!$change->getId()) {
                    _em()->flush();
                }

                return $change;
            },
        ];
    }
}
