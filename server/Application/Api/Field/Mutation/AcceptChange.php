<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\Enum\ChangeType;
use Application\Model\Card;
use Application\Model\Change;
use Application\Model\User;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Ecodev\Felix\Api\Field\FieldInterface;
use Exception;
use GraphQL\Type\Definition\Type;

class AcceptChange implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'acceptChange' => fn () => [
            'type' => _types()->getOutput(Card::class),
            'description' => 'Accept the change and return the modified Image, unless if it has been deleted',
            'args' => [
                'id' => Type::nonNull(_types()->getId(Change::class)),
            ],
            'resolve' => function ($root, array $args): ?Card {
                /** @var Change $change */
                $change = $args['id']->getEntity();
                Helper::throwIfDenied($change, 'update');

                $image = null;
                switch ($change->getType()) {
                    case ChangeType::Create:
                        $image = $change->getSuggestion();
                        $image->setOwner(User::getCurrent());

                        $changeSet = ['need some value here'];
                        $fakeEvent = new PreUpdateEventArgs($image, _em(), $changeSet);
                        $image->timestampUpdate($fakeEvent);

                        break;
                    case ChangeType::Update:
                        $image = $change->getOriginal();
                        $change->getSuggestion()->copyInto($image);
                        _em()->remove($change->getSuggestion());

                        break;
                    case ChangeType::Delete:
                        $original = $change->getOriginal();

                        // Trigger proxy loading, so the image on disk will be able to be deleted after the flush
                        $original->getPath();

                        _em()->remove($original);

                        break;
                    default:
                        throw new Exception('Unsupported change type: ' . $change->getType());
                }

                _em()->remove($change);
                _em()->flush();

                return $image;
            },
        ];
    }
}
