<?php

declare(strict_types=1);

namespace ApplicationTest\Traits;

use Application\Model\User;
use Doctrine\ORM\EntityManager;

/**
 * Allow to run test within a database transaction, so database will be unchanged after test.
 */
trait TestWithTransaction
{
    /**
     * Get EntityManager.
     */
    public function getEntityManager(): EntityManager
    {
        return _em();
    }

    /**
     * Start transaction.
     */
    protected function setUp(): void
    {
        $this->getEntityManager()->beginTransaction();
        User::setCurrent(null);
    }

    /**
     * Cancel transaction, to undo all changes made.
     */
    protected function tearDown(): void
    {
        $this->getEntityManager()->rollback();
        $this->getEntityManager()->clear();

        // Reset AUTO_INCREMENT to the highest ID (actually not 1), because some tests will increase it by creating
        // and deleting cards and other test rely on this value to be deterministic. And this cannot be done inside
        // the test themselves, because ALTER TABLE will break existing DB transaction
        $this->getEntityManager()->getConnection()->executeStatement('ALTER TABLE card AUTO_INCREMENT = 1;');

        $this->getEntityManager()->getConnection()->close();
    }
}
