<?php

declare(strict_types=1);

namespace ApplicationTest\Middleware;

use Application\DBAL\Types\SiteType;
use Application\Middleware\AuthenticationMiddleware;
use Application\Model\User;
use Application\Repository\UserRepository;
use Cake\Chronos\Chronos;
use Laminas\Diactoros\Response;
use Laminas\Diactoros\ServerRequest;
use Mezzio\Session\Session;
use Mezzio\Session\SessionInterface;
use Mezzio\Session\SessionMiddleware;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class AuthenticationMiddlewareTest extends TestCase
{
    public function testEmptySession(): void
    {
        $session = $this->process(false, null);

        self::assertFalse($session->has('user'));
        self::assertNull(User::getCurrent());
    }

    public function testUserNotFound(): void
    {
        $user = null;
        $session = $this->process(true, $user);

        self::assertFalse($session->has('user'));
        self::assertNull(User::getCurrent());
    }

    public function testUserTooOld(): void
    {
        $user = new User();
        $user->setActiveUntil(new Chronos('2000-01-02'));
        $session = $this->process(true, $user);

        self::assertFalse($session->has('user'));
        self::assertNull(User::getCurrent());
    }

    public function testUserStillActive(): void
    {
        $user = new User();
        $user->setActiveUntil(new Chronos('2099-01-02'));
        $session = $this->process(true, $user);

        self::assertTrue($session->has('user'));
        self::assertSame($user, User::getCurrent());
    }

    public function testUserNoLimit(): void
    {
        $user = new User();
        $session = $this->process(true, $user);

        self::assertTrue($session->has('user'));
        self::assertSame($user, User::getCurrent());
    }

    private function process(bool $userInSession, ?User $user): SessionInterface
    {
        User::setCurrent(null);

        $userRepository = new class($user) extends UserRepository {
            private $user;

            public function __construct(?User $user)
            {
                $this->user = $user;
            }

            public function getOneById(int $id): ?User
            {
                return $this->user;
            }
        };

        $session = new Session([]);
        if ($userInSession) {
            $session->set('user', 123);
        }
        $request = new ServerRequest();
        $request = $request->withAttribute(SessionMiddleware::SESSION_ATTRIBUTE, $session);

        $response = new Response();
        $handler = new class($response) implements RequestHandlerInterface {
            private $response;

            public function __construct(ResponseInterface $response)
            {
                $this->response = $response;
            }

            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                return $this->response;
            }
        };

        $middleware = new AuthenticationMiddleware($userRepository, SiteType::DILPS);
        $middleware->process($request, $handler);

        return $session;
    }
}
