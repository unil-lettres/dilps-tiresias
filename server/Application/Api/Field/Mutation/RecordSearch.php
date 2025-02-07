<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Enum\Site;
use Application\Model\Statistic;
use Application\Repository\StatisticRepository;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;

class RecordSearch implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'recordSearch' => fn () => [
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Record one search in statistics',
            'resolve' => function ($root, array $args): bool {
                /** @var Site $site */
                $site = $root['site'];

                /** @var StatisticRepository $statisticRepository */
                $statisticRepository = _em()->getRepository(Statistic::class);
                $statistic = $statisticRepository->getOrCreate($site);
                $statistic->recordSearch();

                _em()->flush();

                return true;
            },
        ];
    }
}
