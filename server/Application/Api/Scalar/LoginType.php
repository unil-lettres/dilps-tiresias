<?php

declare(strict_types=1);

namespace Application\Api\Scalar;

use Ecodev\Felix\Api\Scalar\AbstractStringBasedType;

class LoginType extends AbstractStringBasedType
{
    /**
     * @var string
     */
    public $description = 'A user login is a non-empty string containing only letters, digits, `.` and `-`.';

    /**
     * Validate a login.
     */
    protected function isValid(?string $value): bool
    {
        return is_string($value) && preg_match('/^[a-zA-Z0-9\\@.-]+$/', $value);
    }
}
