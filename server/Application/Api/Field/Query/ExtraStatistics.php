<?php

declare(strict_types=1);

namespace Application\Api\Field\Query;

use Application\Model\Statistic;
use Application\Model\User;
use Application\Repository\StatisticRepository;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;

abstract class ExtraStatistics implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'extraStatistics' => fn () => [
            'type' => Type::nonNull(Type::string()),
            'description' => 'JSON encoded extra statistics',
            'args' => [
                'period' => Type::nonNull(Type::string()),
                'user' => _types()->getId(User::class),
            ],
            'resolve' => function ($root, array $args): string {
                $site = $root['site'];

                /** @var StatisticRepository $repository */
                $repository = _em()->getRepository(Statistic::class);
                $user = @$args['user'] ? $args['user']->getEntity() : null;

                $result = $repository->getExtraStatistics($site, $args['period'], $user);

                return json_encode($result);
            },
        ];
    }
}
