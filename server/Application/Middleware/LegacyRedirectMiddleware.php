<?php

declare(strict_types=1);

namespace Application\Middleware;

use Application\Repository\CardRepository;
use Interop\Container\ContainerInterface;
use Laminas\Diactoros\Response\RedirectResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class LegacyRedirectMiddleware implements MiddlewareInterface
{
    private \Interop\Container\ContainerInterface $container;

    private \Application\Repository\CardRepository $cardRepository;

    public function __construct(CardRepository $cardRepository, ContainerInterface $container)
    {
        $this->container = $container;
        $this->cardRepository = $cardRepository;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        if (array_key_exists('id', $request->getQueryParams())) {
            $legacyId = $request->getQueryParams()['id'];

            if (!is_numeric($legacyId)) {
                return new RedirectResponse('/login', 302);
            }

            $card = $this->cardRepository->getOneByLegacyId((int) $legacyId);

            if (!$card) {
                return new RedirectResponse('/login', 302);
            }

            $cardPath = '/card/' . $card->getId();

            return new RedirectResponse($cardPath, 302);
        }

        return new RedirectResponse('/login', 302);
    }
}
