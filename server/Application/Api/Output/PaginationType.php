<?php

declare(strict_types=1);

namespace Application\Api\Output;

use GraphQL\Type\Definition\ObjectType;
use ReflectionClass;

class PaginationType extends ObjectType
{
    public function __construct(string $class, string $name)
    {
        $c = new ReflectionClass($class);
        $s = $c->getShortName();
        $name = $s . 'Pagination';

        $config = [
            'name' => $name,
            'description' => 'Describe available pages',
            'fields' => function () use ($class): array {
                return [
                    'offset' => [
                        'type' => self::int(),
                        'description' => 'The zero-based index of the displayed list of items',
                    ],
                    'pageIndex' => [
                        'type' => self::int(),
                        'description' => 'The zero-based page index of the displayed list of items',
                    ],
                    'pageSize' => [
                        'type' => self::nonNull(self::int()),
                        'description' => 'Number of items to display on a page',
                    ],
                    'length' => [
                        'type' => self::nonNull(self::int()),
                        'description' => 'The length of the total number of items that are being paginated',
                    ],
                    'items' => [
                        'type' => self::nonNull(self::listOf(self::nonNull(_types()->getOutput($class)))),
                        'description' => 'Paginated items',
                    ],
                ];
            },
        ];

        parent::__construct($config);
    }
}
