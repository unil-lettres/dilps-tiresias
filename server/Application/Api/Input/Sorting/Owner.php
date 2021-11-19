<?php

declare(strict_types=1);

namespace Application\Api\Input\Sorting;

use Application\Model\User;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Doctrine\Sorting\SortingInterface;

/**
 * Sort items by their owner's full name.
 */
class Owner implements SortingInterface
{
    public function __construct()
    {
    }

    public function __invoke(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias, string $order): void
    {
        $owner = $uniqueNameFactory->createAliasName(User::class);
        $queryBuilder->leftJoin($alias . '.owner', $owner);

        $queryBuilder->addOrderBy($owner . '.login', $order);
    }
}
