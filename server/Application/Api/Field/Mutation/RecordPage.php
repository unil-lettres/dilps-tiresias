<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Model\Statistic;
use GraphQL\Type\Definition\Type;

class RecordPage implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'recordPage',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Record one page visit in statistics',
            'resolve' => function (string $site, array $args): bool {

                /** @var Statistic $statistic */
                $statistic = _em()->getRepository(Statistic::class)->getOrCreate($site);
                $statistic->recordPage();

                _em()->flush();

                return true;
            },
        ];
    }
}
