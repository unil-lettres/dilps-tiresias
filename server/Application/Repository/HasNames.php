<?php

declare(strict_types=1);

namespace Application\Repository;

/**
 * Trait for all repositories with a name.
 */
trait HasNames
{
    /**
     * Returns an array of names and their ID for all entries in the DB.
     */
    public function getNames(): array
    {
        $connection = $this->getEntityManager()->getConnection();
        $table = $this->getClassMetadata()->getTableName();
        $table = $connection->quoteIdentifier($table);

        $sql = 'SELECT id, name FROM ' . $table . ' ORDER BY name ASC';

        $records = $connection->executeQuery($sql)->fetchAllAssociative();

        $result = [];
        foreach ($records as $r) {
            $result[$r['name']] = $r['id'];
        }

        return $result;
    }
}
