<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Model\Statistic;
use Application\Repository\StatisticRepository;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;

class RecordPage implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'recordPage',
            'type' => Type::nonNull(Type::boolean()),
            'description' => 'Record one page visit in statistics',
            'resolve' => function (array $root, array $args): bool {
                $site = $root['site'];

                /** @var StatisticRepository $statisticRepository */
                $statisticRepository = _em()->getRepository(Statistic::class);
                $statistic = $statisticRepository->getOrCreate($site);
                $statistic->recordPage();

                _em()->flush();

                return true;
            },
        ];
    }
}
