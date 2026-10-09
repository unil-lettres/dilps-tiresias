<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Application\Enum\CollectionVisibility;
use Application\Model\User;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\LeafType;

/**
 * Filter the collections whose content the current user may manage, like the `linkCard` privilege: the ones they own or
 * are one of the responsibles of, plus the non-private ones for administrators, and all of them for majors.
 *
 * The client could express it with two groups of conditions, but the hierarchic selector of natural cannot merge groups
 * of different logics, so it must be a single condition.
 */
class ManageableByViewerOperatorType extends AbstractOperatorType
{
    protected function getConfiguration(LeafType $leafType): array
    {
        return [
            'description' => 'Filter collections whose content the current user may manage',
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

        if ($user->getRole() === User::ROLE_MAJOR) {
            return '';
        }

        $param = $uniqueNameFactory->createParameterName();
        $queryBuilder->setParameter($param, $user);
        $condition = "$alias.owner = :$param OR :$param MEMBER OF $alias.responsibles";

        if ($user->getRole() === User::ROLE_ADMINISTRATOR) {
            $visibilities = $uniqueNameFactory->createParameterName();
            $queryBuilder->setParameter($visibilities, [CollectionVisibility::Member->value, CollectionVisibility::Administrator->value]);
            $condition .= " OR $alias.visibility IN (:$visibilities)";
        }

        return "($condition)";
    }
}
