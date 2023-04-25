<?php

declare(strict_types=1);

namespace Application\Middleware;

use Application\Model\User;
use Application\Repository\UserRepository;
use Mezzio\Session\SessionInterface;
use Mezzio\Session\SessionMiddleware;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class AuthenticationMiddleware implements MiddlewareInterface
{
    public function __construct(private readonly UserRepository $userRepository, private readonly string $site)
    {
    }

    /**
     * Load current user from session if exists and still valid.
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

            if ($user && $user->canLogin()) {
                User::setCurrent($user);
            }

            // If we were supposed to be logged in, but the user is not available anymore, that means the user
            // was forcibly logged out (likely deleted), so we clear his entire session
            if (!User::getCurrent()) {
                $session->clear();
            }
        }

        return $handler->handle($request);
    }

    /**
     * Check if Shibboleth session is available and if the user is already created in the database.
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
     * Generate login for aai users based on received attributes.
     *
     * @return string $login
     */
    private function generateShibbolethLogin(array $serverParams): string
    {
        if (array_key_exists('uid', $serverParams)) {
            if (array_key_exists('homeOrganization', $serverParams)) {
                $login = match ($serverParams['homeOrganization']) {
                    'unil.ch' => '-unil-' . $serverParams['uid'],
                    'unine.ch' => '-unine-' . $serverParams['uid'],
                    default => '-aai-' . $serverParams['uid'],
                };
            } else {
                $login = '-aai-' . $serverParams['uid'];
            }
        } else {
            $login = $serverParams['mail'];
        }

        return $login;
    }
}
