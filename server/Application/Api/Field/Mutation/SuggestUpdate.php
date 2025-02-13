<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\Enum\ChangeType;
use Application\Enum\Site;
use Application\Model\Card;
use Application\Model\Change;
use Application\Repository\ChangeRepository;
use Ecodev\Felix\Api\Exception;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;

class SuggestUpdate implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'suggestUpdate' => fn () => [
            'type' => Type::nonNull(_types()->getOutput(Change::class)),
            'description' => 'Suggest the update of an existing image',
            'args' => [
                'id' => Type::nonNull(_types()->getId(Card::class)),
                'request' => Type::nonNull(Type::string()),
            ],
            'resolve' => function ($root, array $args): Change {
                /** @var Site $site */
                $site = $root['site'];

                $suggestion = $args['id']->getEntity();
                $original = $suggestion->getOriginal();

                if (!$original) {
                    throw new Exception('An suggestion must have an original defined');
                }

                /** @var ChangeRepository $changeRepository */
                $changeRepository = _em()->getRepository(Change::class);
                $change = $changeRepository->getOrCreate(ChangeType::Update, $suggestion, $args['request'], $site);
                Helper::throwIfDenied($change, 'create');

                if (!$change->getId()) {
                    _em()->flush();
                }

                return $change;
            },
        ];
    }
}
