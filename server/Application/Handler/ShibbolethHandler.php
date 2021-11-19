<?php

declare(strict_types=1);

namespace Application\Handler;

use Interop\Container\ContainerInterface;
use Laminas\Diactoros\Response\RedirectResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class ShibbolethHandler implements RequestHandlerInterface
{
    private ContainerInterface $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        // Redirect to specific moodle url if moodle parameter found in the query params
        if (array_key_exists('moodle', $request->getQueryParams())) {
            $moodleUrl = $this->container->get('config')['moodle']['redirectUrl'] . '?id=' . $request->getQueryParams()['moodle'];

            return new RedirectResponse($moodleUrl, 302);
        }

        // Redirect to quizz url if quizz parameter is found in the query params
        if (array_key_exists('quizz', $request->getQueryParams())) {
            $quizzUrl = '/quizz;cards=' . $request->getQueryParams()['quizz'] . ';nav=0';

            return new RedirectResponse($quizzUrl, 302);
        }

        // Redirect to return url if return url is found in the query params
        if (array_key_exists('returnUrl', $request->getQueryParams())) {
            $returnUrl = $request->getQueryParams()['returnUrl'] ?: '/';

            return new RedirectResponse($returnUrl, 302);
        }

        // Redirect to the standard path otherwise
        return new RedirectResponse('/login', 302);
    }
}
