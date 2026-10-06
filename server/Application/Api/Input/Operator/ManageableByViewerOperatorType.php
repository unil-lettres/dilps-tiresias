<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Application\Model\User;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\LeafType;

/**
 * Filter the collections whose content the current user may manage, because they own them or are one of their responsibles.
 *
 * The client could express it with two groups of conditions, but the hierarchic selector of natural cannot merge groups
 * of different logics, so it must be a single condition.
 */
class ManageableByViewerOperatorType extends AbstractOperatorType
{
    protected function getConfiguration(LeafType $leafType): array
    {
        return [
            'description' => 'Filter collections that the current user owns, or is one of the responsibles of',
            'fields' => [
                [
                    'name' => 'value',
                    'type' => self::nonNull($leafType),
                    'description' => 'whether to filter at all',
                ],
            ],
        ];
    }

    public function getDqlCondition(UniqueNameFactory $uniqueNameFactory, ClassMetadata $metadata, QueryBuilder $queryBuilder, string $alias, string $field, ?array $args): string
    {
        if (!$args || !$args['value']) {
            return '';
        }

        $user = User::getCurrent();
        if (!$user) {
            return '1 = 0';
        }

        $param = $uniqueNameFactory->createParameterName();
        $queryBuilder->setParameter($param, $user);

        return "($alias.owner = :$param OR :$param MEMBER OF $alias.responsibles)";
    }
}
