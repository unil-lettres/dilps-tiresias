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
            'query' => _types()->get(QueryType::class),
            'mutation' => _types()->get(MutationType::class),
            'typeLoader' => fn ($name) => _types()->get($name),
        ];

        parent::__construct($config);
    }
}
