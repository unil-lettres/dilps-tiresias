<?php

declare(strict_types=1);

namespace Application\Repository;

/**
 * Trait for all repositories with a parent.
 */
trait HasParent
{
    /**
     * Returns an array of fullNames and their ID for all domains.
     */
    public function getFullNames(): array
    {
        $connection = $this->getEntityManager()->getConnection();
        $table = $this->getClassMetadata()->getTableName();
        $table = $connection->quoteIdentifier($table);

        $sql = 'WITH RECURSIVE parent AS (
    SELECT id, parent_id, name AS fullName FROM ' . $table . ' WHERE parent_id IS NULL
    UNION
    SELECT child.id, child.parent_id, CONCAT(parent.fullName, " > ", child.name) AS fullName FROM ' . $table . ' AS child JOIN parent ON child.parent_id = parent.id
) SELECT id, fullName FROM parent ORDER BY fullName ASC';

        $records = $connection->executeQuery($sql)->fetchAllAssociative();

        $result = [];
        foreach ($records as $r) {
            $result[$r['fullName']] = $r['id'];
        }

        return $result;
    }
}
