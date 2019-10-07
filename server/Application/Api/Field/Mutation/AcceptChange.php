<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\Model\Card;
use Application\Model\Change;
use Application\Model\User;
use GraphQL\Type\Definition\Type;

class AcceptChange implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'acceptChange',
            'type' => _types()->getOutput(Card::class),
            'description' => 'Accept the change and return the modified Image, unless if it has been deleted',
            'args' => [
                'id' => Type::nonNull(_types()->getId(Change::class)),
            ],
            'resolve' => function (string $site, array $args): ?Card {
                /** @var Change $change */
                $change = $args['id']->getEntity();
                Helper::throwIfDenied($change, 'update');

                $image = null;
                switch ($change->getType()) {
                    case Change::TYPE_CREATE:
                        $image = $change->getSuggestion();
                        $image->setOwner(User::getCurrent());
                        $image->timestampUpdate();

                        break;
                    case Change::TYPE_UPDATE:
                        $image = $change->getOriginal();
                        $change->getSuggestion()->copyInto($image);
                        _em()->remove($change->getSuggestion());

                        break;
                    case Change::TYPE_DELETE:
                        $original = $change->getOriginal();

                        // Trigger proxy loading, so the image on disk will be able to be deleted after the flush
                        $original->getPath();

                        _em()->remove($original);

                        break;
                    default:
                        throw new \Exception('Unsupported change type: ' . $change->getType());
                }

                _em()->remove($change);
                _em()->flush();

                return $image;
            },
        ];
    }
}
