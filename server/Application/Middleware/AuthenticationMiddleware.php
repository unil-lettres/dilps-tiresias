<?php

declare(strict_types=1);

namespace Application\Middleware;

use Application\Model\User;
use Application\Repository\UserRepository;
use DateTimeImmutable;
use Mezzio\Session\SessionInterface;
use Mezzio\Session\SessionMiddleware;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

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
     * @param array $serverParams
     */
    private function shibboleth(SessionInterface $session, array $serverParams): void
    {
        if (array_key_exists('Shib-Identity-Provider', $serverParams) && !$session->has('user')) {
            // User has Shibboleth session but no user session
            if (array_key_exists('mail', $serverParams)) {
                // Check for the user in the db
                $user = $this->userRepository->getOneByEmail($serverParams['mail'], $this->site);

                if (!$user) {
                    $login = $this->generateShibbolethLogin($serverParams);

                    // Create user if a Shibboleth session is found but user cannot be found in the db
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

    /**
     * Generate login for aai users based on received attributes
     *
     * @param array $serverParams
     *
     * @return string $login
     */
    private function generateShibbolethLogin(array $serverParams): string
    {
        if (array_key_exists('uid', $serverParams)) {
            if (array_key_exists('homeOrganization', $serverParams)) {
                switch ($serverParams['homeOrganization']) {
                    case 'unil.ch':
                        $login = '-unil-' . $serverParams['uid'];

                        break;
                    case 'unine.ch':
                        $login = '-unine-' . $serverParams['uid'];

                        break;
                    default:
                        $login = '-aai-' . $serverParams['uid'];

                        break;
                }
            } else {
                $login = '-aai-' . $serverParams['uid'];
            }
        } else {
            $login = $serverParams['mail'];
        }

        return $login;
    }
}
