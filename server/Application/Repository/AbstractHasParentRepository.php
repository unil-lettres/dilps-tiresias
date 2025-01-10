<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\AbstractModel;
use Application\Traits\HasParentInterface;

/**
 * @template T of HasParentInterface & AbstractModel
 *
 * @extends AbstractRepository<T>
 */
abstract class AbstractHasParentRepository extends AbstractRepository
{
    /**
     * Native query to return the IDs of myself and all recursive descendants
     * of the one passed as parameter.
     */
    public function getSelfAndDescendantsSubQuery(int $itemId): string
    {
        $table = $this->getClassMetadata()->table['name'];

        $connection = $this->getEntityManager()->getConnection();
        $table = $connection->quoteIdentifier($table);
        $id = $connection->quote($itemId);

        $entireHierarchySql = "
            WITH RECURSIVE parent AS (
                    SELECT $table.id, $table.parent_id FROM $table WHERE $table.id IN ($id)
                    UNION
                    SELECT $table.id, $table.parent_id FROM $table JOIN parent ON $table.parent_id = parent.id
                )
            SELECT id FROM parent ORDER BY id";

        return trim($entireHierarchySql);
    }

    /**
     * Returns an array of fullNames and their ID for all entries in the DB for
     * the given site.
     */
    public function getFullNames(string $site): array
    {
        $connection = $this->getEntityManager()->getConnection();
        $table = $this->getClassMetadata()->getTableName();
        $table = $connection->quoteIdentifier($table);

        $sql = 'WITH RECURSIVE parent AS (
    SELECT id, parent_id, name AS fullName FROM ' . $table . ' WHERE parent_id IS NULL and site = :site
    UNION
    SELECT child.id, child.parent_id, CONCAT(parent.fullName, " > ", child.name) AS fullName FROM ' . $table . ' AS child JOIN parent ON child.parent_id = parent.id
) SELECT id, fullName FROM parent ORDER BY fullName ASC';

        $records = $connection->executeQuery($sql, ['site' => $site])->fetchAllAssociative();

        $result = [];
        foreach ($records as $r) {
            $result[$r['fullName']] = $r['id'];
        }

        return $result;
    }
}
