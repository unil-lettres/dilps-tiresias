<?php

declare(strict_types=1);

namespace Application\Api\Input\Sorting;

use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Doctrine\Sorting\SortingInterface;

class InstitutionLocality implements SortingInterface
{
    public function __construct()
    {
    }

    public function __invoke(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias, string $order): void
    {
        $alias = $queryBuilder->getDQLPart('from')[0]->getAlias();
        $queryBuilder->leftJoin($alias . '.institution', 'sortingInstitution');
        $queryBuilder->addOrderBy('sortingInstitution.locality', $order);
    }
}
