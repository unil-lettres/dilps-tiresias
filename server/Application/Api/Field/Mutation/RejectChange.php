<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\Enum\ChangeType;
use Application\Model\Change;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;

class RejectChange implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'rejectChange' => fn () => [
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Reject the change',
            'args' => [
                'id' => Type::nonNull(_types()->getId(Change::class)),
            ],
            'resolve' => function ($root, array $args): bool {
                /** @var Change $change */
                $change = $args['id']->getEntity();

                Helper::throwIfDenied($change, 'update');

                // The copy of a card, suggesting to update it, is useless once rejected, and its owner could neither update
                // nor delete it anymore. But a card suggested for creation belongs to its owner, who may submit it again.
                $suggestion = $change->getSuggestion();
                if ($change->getType() === ChangeType::Update && $suggestion) {
                    // Trigger lazy loading, so the image on disk will be able to be deleted after the flush
                    $suggestion->getPath();

                    _em()->remove($suggestion);
                }

                _em()->remove($change);
                _em()->flush();

                return true;
            },
        ];
    }
}
