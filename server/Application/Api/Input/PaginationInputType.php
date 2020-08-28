<?php

declare(strict_types=1);

namespace Application\Api\Input;

use GraphQL\Type\Definition\InputObjectType;

class PaginationInputType extends InputObjectType
{
    public static function build()
    {
        return [
            'name' => 'pagination',
            'type' => _types()->get(self::class),
            'defaultValue' => [
                'offset' => null,
                'pageIndex' => 0,
                'pageSize' => 50,
            ],
        ];
    }

    public function __construct()
    {
        $config = [
            'description' => 'Describe what page we want',
            'fields' => function (): array {
                return [
                    'offset' => [
                        'type' => self::int(),
                        'description' => 'The zero-based index of the displayed list of items',
                    ],
                    'pageIndex' => [
                        'type' => self::int(),
                        'defaultValue' => 0,
                        'description' => 'The zero-based page index of the displayed list of items',
                    ],
                    'pageSize' => [
                        'type' => self::int(),
                        'description' => 'Number of items to display on a page',
                    ],
                ];
            },
        ];

        parent::__construct($config);
    }
}
