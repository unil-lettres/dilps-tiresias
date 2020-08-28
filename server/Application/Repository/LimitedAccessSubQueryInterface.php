<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\User;

/**
 * Interface for repositories whose objects access must be limited for user
 */
interface LimitedAccessSubQueryInterface
{
    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     */
    public function getAccessibleSubQuery(?User $user): string;
}
