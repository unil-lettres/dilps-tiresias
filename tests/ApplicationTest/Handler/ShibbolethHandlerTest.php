<?php

declare(strict_types=1);

namespace ApplicationTest\Handler;

use Application\Handler\ShibbolethHandler;
use Laminas\Diactoros\ServerRequest;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Psr\Container\ContainerInterface;

class ShibbolethHandlerTest extends TestCase
{
    #[DataProvider('providerReturnUrl')]
    public function testReturnUrl(string $returnUrl, string $expected): void
    {
        $handler = new ShibbolethHandler(self::createStub(ContainerInterface::class));
        $request = new ServerRequest()->withQueryParams(['returnUrl' => $returnUrl]);

        $response = $handler->handle($request);

        self::assertSame(302, $response->getStatusCode());
        self::assertSame($expected, $response->getHeaderLine('location'));
    }

    public static function providerReturnUrl(): iterable
    {
        yield 'empty' => ['', '/'];
        yield 'root' => ['/', '/'];
        yield 'local path' => ['/collection/2000?foo=bar', '/collection/2000?foo=bar'];
        yield 'other site' => ['https://example.com/login', '/'];
        yield 'protocol-relative' => ['//example.com/login', '/'];
        yield 'protocol-relative with backslash' => ['/\example.com/login', '/'];
        yield 'protocol-relative with tab' => ["/\t/example.com/login", '/'];
        yield 'protocol-relative with newline' => ["/\n/example.com/login", '/'];
        yield 'relative path' => ['collection/2000', '/'];
        yield 'javascript' => ['javascript:alert(1)', '/'];
    }
}
