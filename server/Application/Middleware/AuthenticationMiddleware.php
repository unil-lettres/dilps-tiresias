<?php

declare(strict_types=1);

namespace Application\Middleware;

use Application\Model\User;
use Application\Repository\UserRepository;
use DateTimeImmutable;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Expressive\Session\SessionInterface;
use Zend\Expressive\Session\SessionMiddleware;

class AuthenticationMiddleware implements MiddlewareInterface
{
    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @var string
     */
    private $site;

    public function __construct(UserRepository $userRepository, string $site)
    {
        $this->userRepository = $userRepository;
        $this->site = $site;
    }

    /**
     * Load current user from session if exists and still valid
     *
     * @param ServerRequestInterface $request
     * @param RequestHandlerInterface $handler
     *
     * @return ResponseInterface
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        /** @var SessionInterface $session */
        $session = $request->getAttribute(SessionMiddleware::SESSION_ATTRIBUTE);
        /** @var array $serverParams */
        $serverParams = $request->getServerParams();

        $this->shibboleth($session, $serverParams);

        if ($session->has('user')) {
            $user = $this->userRepository->getOneById($session->get('user'));

            if ($user && (!$user->getActiveUntil() || $user->getActiveUntil() > new DateTimeImmutable())) {
                User::setCurrent($user);
            }
        }

        if (!User::getCurrent()) {
            $session->clear();
        }

        return $handler->handle($request);
    }

    /**
     * Check if Shibboleth session is available and if the user is already created in the database
     *
     * @param SessionInterface $session
     */
    private function shibboleth(SessionInterface $session, array $serverParams): void
    {
        if (array_key_exists('Shib-Identity-Provider', $serverParams) && !$session->has('user')) {
            // User has Shibboleth session but no user session
            if (array_key_exists('mail', $serverParams)) {
                $user = $this->userRepository->getOneByEmail($serverParams['mail'], $this->site);

                if (!$user) {
                    $login = array_key_exists('uid', $serverParams) ?
                        '-aai-' . $serverParams['uid'] : $serverParams['mail'];

                    $user = $this->userRepository->createShibboleth(
                        $login,
                        $serverParams['mail'],
                        $this->site
                    );
                }

                $session->set('user', $user->getId());
            }
        }
    }
}
