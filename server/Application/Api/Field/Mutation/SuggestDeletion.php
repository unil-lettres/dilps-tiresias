<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\Model\Card;
use Application\Model\Change;
use Ecodev\Felix\Api\Field\FieldInterface;
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
            'resolve' => function (array $root, array $args): Change {
                $site = $root['site'];

                $original = $args['id']->getEntity();
                $change = _em()->getRepository(Change::class)->getOrCreate(Change::TYPE_DELETE, $original, $args['request'], $site);

                Helper::throwIfDenied($change, 'create');

                if (!$change->getId()) {
                    _em()->flush();
                }

                return $change;
            },
        ];
    }
}
