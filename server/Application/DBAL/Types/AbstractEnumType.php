<?php

declare(strict_types=1);

namespace Application\DBAL\Types;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;
use InvalidArgumentException;
use ReflectionClass;

abstract class AbstractEnumType extends Type
{
    public function getSqlDeclaration(array $fieldDeclaration, AbstractPlatform $platform)
    {
        $possibleValues = $this->getPossibleValues();
        $quotedPossibleValues = implode(', ', array_map(function ($str) {
            return "'" . (string) $str . "'";
        }, $possibleValues));

        $sql = 'ENUM(' . $quotedPossibleValues . ')';

        return $sql;
    }

    public function convertToPHPValue($value, AbstractPlatform $platform)
    {
        if ($value === null || '' === $value) {
            return null;
        }

        if (!in_array($value, $this->getPossibleValues(), true)) {
            throw new InvalidArgumentException("Invalid '" . $value . "' value fetched from database for enum " . get_class($this));
        }

        return (string) $value;
    }

    public function convertToDatabaseValue($value, AbstractPlatform $platform)
    {
        if ($value === null || '' === $value) {
            return null;
        }

        if (!in_array($value, $this->getPossibleValues(), true)) {
            throw new InvalidArgumentException("Invalid '" . $value . "' value to be stored in database for enum " . get_class($this));
        }

        return (string) $value;
    }

    /**
     * Return all possibles values as an array of string
     *
     * @return string[]
     */
    abstract protected function getPossibleValues(): array;

    /**
     * Returns the type name based on actual class name
     */
    public function getName(): string
    {
        $class = new ReflectionClass($this);
        $shortClassName = $class->getShortName();
        $typeName = preg_replace('/Type$/', '', $shortClassName);

        return $typeName;
    }

    public function requiresSQLCommentHint(AbstractPlatform $platform)
    {
        return true;
    }

    public function getMappedDatabaseTypes(AbstractPlatform $platform)
    {
        return ['enum'];
    }
}
