<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Scalar;

use Application\Api\Scalar\DateTimeType;
use PHPUnit\Framework\TestCase;

class DateTimeTypeTest extends TestCase
{
    private $timezone;

    protected function setUp(): void
    {
        $this->timezone = date_default_timezone_get();
        date_default_timezone_set('Europe/Zurich');
    }

    protected function tearDown(): void
    {
        date_default_timezone_set($this->timezone);
    }

    /**
     * @dataProvider providerParseValue
     */
    public function testParseValue(string $input, ?string $expected): void
    {
        $type = new DateTimeType();
        $actual = $type->parseValue($input);
        if ($actual) {
            $actual = $actual->format('c');
        }

        self::assertSame($expected, $actual);
    }

    public function providerParseValue(): array
    {
        return [
            'UTC' => ['2018-09-14T22:00:00.000Z', '2018-09-15T00:00:00+02:00'],
            'local time' => ['2018-09-15T00:00:00+02:00', '2018-09-15T00:00:00+02:00'],
            'other time' => ['2018-09-15T02:00:00+04:00', '2018-09-15T00:00:00+02:00'],
            'empty string' => ['', null],
        ];
    }
}
