<?php

declare(strict_types=1);

namespace ApplicationTest;

use Application\Model\User;
use Application\Utility;

class UtilityTest extends \PHPUnit\Framework\TestCase
{
    public function testNow(): void
    {
        self::assertStringStartsWith('202', Utility::getNow()->format('c'));
    }

    public function testGetShortClassName(): void
    {
        self::assertSame('User', Utility::getShortClassName(new User()));
    }

    /**
     * @dataProvider providerFormatYearRange
     */
    public function testFormatYearRange(array $args, string $expected): void
    {
        $actual = Utility::formatYearRange(...$args);
        self::assertSame($actual, $expected);
    }

    public function providerFormatYearRange(): array
    {
        return [
            [[123, 456], ' (entre 123 et 456)'],
            [[null, 456], ' (456)'],
            [[123, null], ' (123)'],
            [[null, null], ''],
        ];
    }
}
