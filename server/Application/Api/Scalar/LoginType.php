<?php

declare(strict_types=1);

namespace Application\Api\Scalar;

use GraphQL\Error\Error;
use GraphQL\Language\AST\Node;
use GraphQL\Language\AST\StringValueNode;
use GraphQL\Type\Definition\ScalarType;

class LoginType extends ScalarType
{
    /**
     * @var string
     */
    public $description = 'A user login is a non-empty string containing only letters, digits, `.` and `-`.';

    /**
     * Serializes an internal value to include in a response.
     *
     * @param mixed $value
     *
     * @return mixed
     */
    public function serialize($value)
    {
        // Assuming internal representation of url is always correct:
        return $value;
    }

    /**
     * Parses an externally provided value (query variable) to use as an input
     *
     * @param mixed $value
     *
     * @return mixed
     */
    public function parseValue($value)
    {
        if (!$this->isValid($value)) {
            throw new \UnexpectedValueException('Query error: Not a valid login: ' . $value);
        }

        return $value;
    }

    /**
     * Parses an externally provided literal value to use as an input (e.g. in Query AST)
     *
     * @param Node $ast
     * @param null|array $variables
     *
     * @return null|string
     */
    public function parseLiteral($ast, array $variables = null)
    {
        // Note: throwing GraphQL\Error\Error vs \UnexpectedValueException to benefit from GraphQL
        // error location in query:
        if (!($ast instanceof StringValueNode)) {
            throw new Error('Query error: Can only parse strings got: ' . $ast->kind, [$ast]);
        }

        if (!$this->isValid($ast->value)) {
            throw new Error('Query error: Not a valid login', [$ast]);
        }

        return $ast->value;
    }

    /**
     * Validate a login
     *
     * @param mixed $value
     *
     * @return bool
     */
    private function isValid($value): bool
    {
        return is_string($value) && preg_match('/^[a-zA-Z0-9\\.-]+$/', $value);
    }
}
