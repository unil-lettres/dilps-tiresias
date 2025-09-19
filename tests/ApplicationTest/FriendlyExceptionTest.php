<?php

declare(strict_types=1);

namespace ApplicationTest;

use Application\FriendlyException;
use Ecodev\Felix\Api\Exception;
use ImagickException;
use Imagine\Exception\RuntimeException;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;
use Throwable;

class FriendlyExceptionTest extends TestCase
{
    /**
     * @dataProvider providerTry
     */
    public function testTry(?Throwable $thrown, ?string $expectedClass, ?string $expectedMessage): void
    {
        $rethrown = null;
        $result = null;

        try {
            $result = FriendlyException::try(fn () => $thrown ? throw $thrown : 'returned');
        } catch (Throwable $e) {
            $rethrown = $e;
        }

        if ($expectedClass) {
            self::assertNull($result);
            self::assertInstanceOf($expectedClass, $rethrown);
            self::assertMatchesRegularExpression($expectedMessage, $rethrown->getMessage());
            self::assertSame($expectedClass === Exception::class ? $thrown : null, $rethrown->getPrevious());
        } else {
            self::assertSame('returned', $result);
        }
    }

    public function providerTry(): iterable
    {
        yield [
            $this->createImagickException("width or height exceeds limit `/sites/dilps.lan/data/cache/images/68b051784b5ba-5.webp' @ error/webp.c/WriteWEBPImage/1147"),
            Exception::class,
            '~^Maximum image dimension is .+ x .+ pixels, but it was exceeded$~',
        ];

        yield [
            $this->createImagickException("cache resources exhausted `white' @ error/cache.c/OpenPixelCache/4119."),
            Exception::class,
            '~^Maximum cache size is .+iB, but it was exceeded$~',
        ];

        yield [
            $this->createImagickException("Unable to open image /sites/dilps.lan/data/images/68b054ec8f219.JPGtime limit exceeded `/sites/dilps.lan/data/images/68b054ec8f219.JPG' @ fatal/cache.c/GetImagePixelCache/1867"),
            Exception::class,
            '~^Maximum image processing time is .+ seconds, but it was exceeded$~',
        ];

        yield [
            new InvalidArgumentException('some unrelated exception'),
            InvalidArgumentException::class,
            '~^some unrelated exception$~',
        ];

        yield 'no exception thrown at all' => [
            null,
            null,
            null,
        ];
    }

    private function createImagickException(string $message): RuntimeException
    {
        return new RuntimeException('test exception', 123, new ImagickException($message, 123));
    }
}
