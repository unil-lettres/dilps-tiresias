<?php

declare(strict_types=1);

namespace Application\Api;

/**
 * Our API schema.
 */
class Schema extends \GraphQL\Type\Schema
{
    public function __construct()
    {
        $config = [
            'query' => fn () => _types()->get(QueryType::class),
            'mutation' => fn () => _types()->get(MutationType::class),
            'typeLoader' => fn (string $name) => _types()->get($name),
        ];

        parent::__construct($config);
    }
}
