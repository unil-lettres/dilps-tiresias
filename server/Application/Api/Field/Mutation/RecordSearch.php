<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Model\Statistic;
use GraphQL\Type\Definition\Type;

class RecordSearch implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'recordSearch',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Record one search in statistics',
            'resolve' => function (string $site, array $args): bool {

                /** @var Statistic $statistic */
                $statistic = _em()->getRepository(Statistic::class)->getOrCreate($site);
                $statistic->recordSearch();

                _em()->flush();

                return true;
            },
        ];
    }
}
