<?php

declare(strict_types=1);

namespace Application\Api\Scalar;

/**
 * Represent an email address
 */
class EmailType extends AbstractStringBasedType
{
    /**
     * Validate a email
     *
     * @param mixed $value
     *
     * @return bool
     */
    protected function isValid($value): bool
    {
        return is_string($value) && filter_var($value, FILTER_VALIDATE_EMAIL);
    }
}
