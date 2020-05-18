<?php

declare(strict_types=1);

namespace ApplicationTest\Traits;

use Application\Model\User;
use Doctrine\ORM\EntityManager;

/**
 * Allow to run test within a database transaction, so database will be unchanged after test
 */
trait TestWithTransaction
{
    /**
     * Get EntityManager
     */
    public function getEntityManager(): EntityManager
    {
        return _em();
    }

    /**
     * Start transaction
     */
    protected function setUp(): void
    {
        $this->getEntityManager()->beginTransaction();
        User::setCurrent(null);
    }

    /**
     * Cancel transaction, to undo all changes made
     */
    protected function tearDown(): void
    {
        $this->getEntityManager()->rollback();
        $this->getEntityManager()->clear();
        $this->getEntityManager()->getConnection()->close();
    }
}
