<?php

declare(strict_types=1);

namespace ApplicationTest\Handler;

use Application\Handler\ImageHandler;
use ApplicationTest\Traits\TestWithTransaction;
use Laminas\Diactoros\ServerRequest;
use PHPUnit\Framework\TestCase;

class ImageHandlerTest extends TestCase
{
    use TestWithTransaction;

    public function testImageCannotRunScripts(): void
    {
        global $container;

        /** @var ImageHandler $handler */
        $handler = $container->get(ImageHandler::class);
        $request = new ServerRequest()->withAttribute('id', 6005)->withQueryParams(['inline' => '']);

        $response = $handler->handle($request);

        self::assertSame(200, $response->getStatusCode());
        self::assertStringContainsString('sandbox', $response->getHeaderLine('content-security-policy'), 'an SVG image opened directly must not run its scripts');
        self::assertSame('nosniff', $response->getHeaderLine('x-content-type-options'));
    }

    public function testImageToResizeRedirectsToItsResizing(): void
    {
        global $container;

        /** @var ImageHandler $handler */
        $handler = $container->get(ImageHandler::class);
        $request = new ServerRequest(uri: '/api/image/6005/123')->withAttribute('id', 6005)->withAttribute('maxHeight', 123);

        $response = $handler->handle($request);
        self::assertSame(302, $response->getStatusCode());
        self::assertSame('/api/image/6005/123?resize=true', $response->getHeaderLine('location'));

        $response = $handler->handle($request->withQueryParams(['inline' => '']));
        self::assertSame('/api/image/6005/123?inline=&resize=true', $response->getHeaderLine('location'));
    }
}
