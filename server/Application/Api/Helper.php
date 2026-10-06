<?php

declare(strict_types=1);

namespace Application\Api;

use Application\Acl\Acl;
use Application\Model\AbstractModel;
use Application\Model\Card;
use Application\Model\User;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Ecodev\Felix\Api\Exception;
use GraphQL\Doctrine\Definition\EntityID;
use RuntimeException;

abstract class Helper
{
    public static function throwIfDenied(AbstractModel $model, string $privilege): void
    {
        $acl = new Acl();
        if (!$acl->isCurrentUserAllowed($model, $privilege)) {
            throw new Exception($acl->getLastDenialMessage());
        }
    }

    /**
     * Throw if the current user cannot submit the given card as a suggestion.
     *
     * Only the creator of a card can submit it, and only as long as they own it, that is until an administrator
     * accepts it. Otherwise, anybody could turn the card of somebody else into a suggestion, and gain the rights
     * that ACL grant on suggestions.
     */
    public static function throwIfCannotSuggest(Card $suggestion): void
    {
        $user = User::getCurrent();
        if (!$user || $suggestion->getCreator() !== $user || $suggestion->getOwner() !== $user) {
            throw new Exception('Only the creator of a card can submit it as a suggestion');
        }
    }

    /**
     * Throw if the filter, or the sorting, uses a field that only administrators can see.
     *
     * Otherwise, anybody could guess the hidden values, eg: with a `like` condition, or by sorting.
     */
    public static function throwIfFilteringOnAdministratorFields(string $class, array $filter, array $sorting = []): void
    {
        if (User::getCurrent()?->getRole() === User::ROLE_ADMINISTRATOR) {
            return;
        }

        foreach ($sorting as $sort) {
            self::throwIfAdministratorField($class, $sort['field'] ?? null);
        }

        foreach ($filter['groups'] ?? [] as $group) {
            self::throwIfFilteringOnAdministratorFieldsInGroup($class, $group);
        }
    }

    public static function paginate(array $pagination, QueryBuilder $query): array
    {
        $offset = max(0, $pagination['offset']);
        $pageIndex = max(0, $pagination['pageIndex']);
        $pageSize = max(0, $pagination['pageSize']);

        $paginator = new Paginator($query);
        $paginator
            ->getQuery()
            ->setFirstResult($offset ?: $pageSize * $pageIndex)
            ->setMaxResults($pageSize);

        try {
            /*
             * We try to disable usage of Output Walkers because they leads to
             * suboptimal queries. But we can't disable them if the query
             * contains to-many(1) joins without disabling "fetchJoinCollection"
             * in Paginator too.
             *
             * Disable "fetchJoinCollection" in Paginator can lead to
             * inconsistent results and compromise the flexibility of this helper.
             *
             * So we try to disable the Output Walkers and if it fails we fallback
             * to the default behavior. It will fail at the Doctrine level and
             * no query will be executed by the database so it's safe to fallback.
             *
             * The solution implemented here may not be the cleanest but it's the
             * most flexible and evolutive one.
             *
             * This optimization is very useful when displaying a collection
             * because it allows to take advantage of the collection indexes and
             * avoid making a full table scan of the card table. Disyplaying an
             * empty collection now take ~130ms instead of ~900ms.
             *
             * (1) queries can contain to-many join when we try to sort cards by
             * artists for example.
             */
            $paginator->setUseOutputWalkers(false);
            $pagination['items'] = $paginator->getIterator();
        } catch (RuntimeException) {
            $paginator->setUseOutputWalkers(true);
            $pagination['items'] = $paginator->getIterator();
        }
        $pagination['length'] = fn () => $paginator->count();

        return $pagination;
    }

    public static function hydrate(AbstractModel $object, array $input): void
    {
        foreach ($input as $name => $value) {
            if ($value instanceof EntityID) {
                $value = $value->getEntity();
            }

            $setter = 'set' . ucfirst($name);
            $object->$setter($value);
        }
    }

    /**
     * Check the conditions of a group, or of a join, and recursively its joins.
     */
    private static function throwIfFilteringOnAdministratorFieldsInGroup(string $class, array $group): void
    {
        foreach ($group['conditions'] ?? [] as $condition) {
            foreach ($condition as $field => $operators) {
                if ($operators !== null) {
                    self::throwIfAdministratorField($class, $field);
                }
            }
        }

        $metadata = _em()->getClassMetadata($class);
        foreach ($group['joins'] ?? [] as $relation => $join) {
            if ($join) {
                self::throwIfFilteringOnAdministratorFieldsInGroup($metadata->getAssociationTargetClass($relation), $join);
            }
        }
    }

    private static function throwIfAdministratorField(string $class, mixed $field): void
    {
        // Fields only visible to administrators, see User::getEmail()
        $administratorFields = [
            User::class => ['email'],
        ];

        if (in_array($field, $administratorFields[$class] ?? [], true)) {
            throw new Exception('Only administrators can filter or sort on ' . $field);
        }
    }
}
