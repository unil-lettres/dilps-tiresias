<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Model\User;

abstract class Role
{
    /**
     * Whether the current user can update from oldRole to newRole
     *
     * The current user is allowed to promote another user up to the same role as himself. So
     * a Senior can promote a Student to Senior. Or an Admin can promote a Junior to Admin.
     *
     * But the current user is **not** allowed to demote a user who has a higher role than himself.
     * That means that a Senior cannot demote an Admin to Student.
     */
    public static function canUpdate(?User $currentUser, string $oldRole, string $newRole): bool
    {
        if ($newRole === $oldRole) {
            return true;
        }

        $currentRole = $currentUser ? $currentUser->getRole() : User::ROLE_ANONYMOUS;
        $orderedRoles = [
            User::ROLE_ANONYMOUS,
            User::ROLE_STUDENT,
            User::ROLE_JUNIOR,
            User::ROLE_SENIOR,
            User::ROLE_MAJOR,
            User::ROLE_ADMINISTRATOR,
        ];

        $newFound = false;
        $oldFound = false;
        foreach ($orderedRoles as $r) {
            if ($r === $oldRole) {
                $oldFound = true;
            }
            if ($r === $newRole) {
                $newFound = true;
            }

            if ($r === $currentRole) {
                break;
            }
        }

        if (!$newFound || !$oldFound) {
            return false;
        }

        return true;
    }
}
