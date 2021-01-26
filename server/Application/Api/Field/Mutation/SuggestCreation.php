<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\Model\Card;
use Application\Model\Change;
use Application\Repository\ChangeRepository;
use Ecodev\Felix\Api\Field\FieldInterface;
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
            'resolve' => function (array $root, array $args): Change {
                $site = $root['site'];

                $suggestion = $args['id']->getEntity();

                /** @var ChangeRepository $changeRepository */
                $changeRepository = _em()->getRepository(Change::class);
                $change = $changeRepository->getOrCreate(Change::TYPE_CREATE, $suggestion, $args['request'], $site);

                Helper::throwIfDenied($change, 'create');

                if (!$change->getId()) {
                    _em()->flush();
                }

                return $change;
            },
        ];
    }
}
