<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Doctrine\ORM\Mapping\ClassMetadata;

/**
 * How to search on an entity joined to the searched entity.
 */
final readonly class JoinedSearch
{
    /**
     * @param string $path DQL path of the association, eg: `card.domains`
     * @param string[] $fields DQL fields to search in the joined entity
     */
    public function __construct(
        public string $path,
        public bool $isToMany,
        public ClassMetadata $metadata,
        public string $alias,
        public array $fields,
    ) {}
}
