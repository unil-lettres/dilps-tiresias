<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Model\Statistic;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;

class RecordSearch implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'recordSearch',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Record one search in statistics',
            'resolve' => function (array $root, array $args): bool {
                $site = $root['site'];

                /** @var Statistic $statistic */
                $statistic = _em()->getRepository(Statistic::class)->getOrCreate($site);
                $statistic->recordSearch();

                _em()->flush();

                return true;
            },
        ];
    }
}
