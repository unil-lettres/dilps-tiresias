<?php

declare(strict_types=1);

namespace ApplicationTest\Middleware;

use Application\Middleware\RefreshSessionTimestampMiddleware;
use Laminas\Diactoros\ServerRequest;
use Mezzio\Session\Session;
use Mezzio\Session\SessionMiddleware;
use PHPUnit\Framework\TestCase;

class RefreshSessionTimestampMiddlewareTest extends TestCase
{
    public function testRefreshTimestampSessionAfterTimeout(): void
    {
        $session = new Session(['user' => '1234']);

        $request = (new ServerRequest())->withAttribute(SessionMiddleware::SESSION_ATTRIBUTE, $session);
        $middleware = new RefreshSessionTimestampMiddleware();

        /**
         * @var \Psr\Http\Server\RequestHandlerInterface $handler
         */
        $handler = $this->createMock(\Psr\Http\Server\RequestHandlerInterface::class);

        $middleware->process($request, $handler);

        self::assertTrue($session->has('_last_access'));
    }
}
