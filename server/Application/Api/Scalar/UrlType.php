<?php

declare(strict_types=1);

namespace Application\Api\Scalar;

use Ecodev\Felix\Api\Scalar\AbstractStringBasedType;

class UrlType extends AbstractStringBasedType
{
    /**
     * @var string
     */
    public $description = 'An absolute web URL that must start with `http` or `https` or be empty.';

    /**
     * Validate an URL.
     *
     * @param mixed $value
     */
    protected function isValid($value): bool
    {
        // Here we use a naive pattern that should ideally be kept in sync with Natural validator
        return $value === '' || is_string($value) && preg_match('~^https?://(?:[^.\s]+\.)+[^.\s]+$~', $value);
    }
}
