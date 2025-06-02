<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Application\Repository\AbstractHasParentRepository;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use Ecodev\Felix\ORM\Query\NativeIn;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\LeafType;

class ExcludeSelfAndDescendantsOperatorType extends AbstractOperatorType
{
    protected function getConfiguration(LeafType $leafType): array
    {
        return [
            'description' => 'Filter items to exclude all descendants recursively and the item itself',
            'fields' => [
                [
                    'name' => 'value',
                    'type' => self::nonNull($leafType),
                    'description' => 'the item ID whose descendants must be excluded',
                ],
            ],
        ];
    }

    public function getDqlCondition(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias, string $field, ?array $args): string
    {
        if (!$args) {
            return '';
        }

        $id = (int) $args['value'];

        /** @var AbstractHasParentRepository $repository */
        $repository = _em()->getRepository($metadata->getName());
        $hierarchySubQuery = $repository->getSelfAndDescendantsSubQuery($id);

        return NativeIn::dql($alias, $hierarchySubQuery, true);
    }
}
