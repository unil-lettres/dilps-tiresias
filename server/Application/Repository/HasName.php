<?php

declare(strict_types=1);

namespace Application\Repository;

/**
 * Trait for all repositories with a name.
 */
trait HasName
{
    /**
     * Returns an array of fullNames and their ID for all domains
     */
    public function getNames(): array
    {
        $connection = $this->getEntityManager()->getConnection();
        $table = $this->getClassMetadata()->getTableName();
        $table = $connection->quoteIdentifier($table);

        $sql = 'SELECT id, name FROM ' . $table . ' ORDER BY name ASC';

        $records = $connection->executeQuery($sql)->fetchAll();

        $result = [];
        foreach ($records as $r) {
            $result[$r['name']] = $r['id'];
        }

        return $result;
    }
}
