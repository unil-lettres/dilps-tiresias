<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\Card;
use GraphQL\Type\Definition\Type;

class ValidateData implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'validateData',
            'type' => Type::nonNull(_types()->getOutput(Card::class)),
            'description' => 'Mark the data of the card as validated now by current user',
            'args' => [
                'id' => Type::nonNull(_types()->getId(Card::class)),
            ],
            'resolve' => function (string $site, array $args): Card {
                $card = $args['id']->getEntity();

                Helper::throwIfDenied($card, 'validate');

                $card->validateData();
                _em()->flush();

                return $card;
            },
        ];
    }
}
