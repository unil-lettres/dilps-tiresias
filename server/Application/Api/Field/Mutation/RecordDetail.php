<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Model\Statistic;
use GraphQL\Type\Definition\Type;

class RecordDetail implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'recordDetail',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Record one detail page visit in statistics',
            'resolve' => function (string $site, array $args): bool {

                /** @var Statistic $statistic */
                $statistic = _em()->getRepository(Statistic::class)->getOrCreate($site);
                $statistic->recordDetail();

                _em()->flush();

                return true;
            },
        ];
    }
}
