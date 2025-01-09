<?php

declare(strict_types=1);

namespace Application\Api\Input\Sorting;

use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Doctrine\Sorting\SortingInterface;

class Domains implements SortingInterface
{
    public function __construct()
    {
    }

    public function __invoke(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias, string $order): void
    {
        $queryBuilder->leftJoin($alias . '.domains', 'sortingDomain');

        // First keep card without any domain at the bottom of the list
        $sortingFieldNullAsHighest = $uniqueNameFactory->createAliasName('sorting');
        $queryBuilder->addSelect('CASE WHEN sortingDomain.name IS NULL THEN 1 ELSE 0 END AS HIDDEN ' . $sortingFieldNullAsHighest);
        $queryBuilder->addOrderBy($sortingFieldNullAsHighest, $order);

        // Then sort cards with domains
        $queryBuilder->addOrderBy('sortingDomain.name', $order);
    }
}
