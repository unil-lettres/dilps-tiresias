<?php

declare(strict_types=1);

namespace Application\Api\Scalar;

class UrlType extends AbstractStringBasedType
{
    /**
     * Validate an URL
     *
     * @param mixed $value
     */
    protected function isValid($value): bool
    {
        return is_string($value) && filter_var($value, FILTER_VALIDATE_URL);
    }
}
