<?php

declare(strict_types=1);

namespace Application\Middleware;

use Interop\Container\ContainerInterface;
use Laminas\Diactoros\Response\RedirectResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class ShibbolethMiddleware implements MiddlewareInterface
{
    /**
     * @var ContainerInterface
     */
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * @param ServerRequestInterface $request
     * @param RequestHandlerInterface $handler
     *
     * @return ResponseInterface
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
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

        return new RedirectResponse('/login', 302);
    }
}
