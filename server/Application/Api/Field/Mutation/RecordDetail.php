<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Model\Statistic;
use Application\Repository\StatisticRepository;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;

class RecordDetail implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'recordDetail',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Record one detail page visit in statistics',
            'resolve' => function (array $root, array $args): bool {
                $site = $root['site'];

                /** @var StatisticRepository $statisticRepository */
                $statisticRepository = _em()->getRepository(Statistic::class);
                $statistic = $statisticRepository->getOrCreate($site);
                $statistic->recordDetail();

                _em()->flush();

                return true;
            },
        ];
    }
}
