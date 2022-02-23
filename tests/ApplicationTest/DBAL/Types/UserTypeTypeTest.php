<?php

declare(strict_types=1);

namespace ApplicationTest\DBAL\Types;

use Application\DBAL\Types\UserTypeType;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class UserTypeTypeTest extends TestCase
{
    private UserTypeType $type;

    private AbstractPlatform $platform;

    protected function setUp(): void
    {
        $this->type = $this->getMockBuilder(UserTypeType::class)->disableOriginalConstructor()
            ->setMethods(null)
            ->getMock();
        $this->platform = $this->createMock(AbstractPlatform::class);
    }

    public function testEnum(): void
    {
        self::assertSame("ENUM('default', 'aai', 'legacy')", $this->type->getSqlDeclaration(['foo'], $this->platform));

        // Should always return string
        self::assertSame('default', $this->type->convertToPHPValue('default', $this->platform));

        // Should support null values or empty string
        self::assertNull($this->type->convertToPHPValue(null, $this->platform));
        self::assertNull($this->type->convertToPHPValue('', $this->platform));
        self::assertNull($this->type->convertToDatabaseValue(null, $this->platform));
        self::assertNull($this->type->convertToDatabaseValue('', $this->platform));

        self::assertTrue($this->type->requiresSQLCommentHint($this->platform));
    }

    public function testConvertToPHPValueThrowsWithInvalidValue(): void
    {
        $this->expectException(InvalidArgumentException::class);

        $this->type->convertToPHPValue('foo', $this->platform);
    }

    public function testConvertToDatabaseValueThrowsWithInvalidValue(): void
    {
        $this->expectException(InvalidArgumentException::class);

        $this->type->convertToDatabaseValue('foo', $this->platform);
    }

    public function testConvertToPHPValueThrowsWithZero(): void
    {
        $this->expectException(InvalidArgumentException::class);

        $this->type->convertToPHPValue(0, $this->platform);
    }

    public function testConvertToDatabaseValueThrowsWithZero(): void
    {
        $this->expectException(InvalidArgumentException::class);

        $this->type->convertToDatabaseValue(0, $this->platform);
    }
}
