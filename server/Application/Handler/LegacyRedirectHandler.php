<?php

declare(strict_types=1);

namespace Application\Handler;

use Application\Repository\CardRepository;
use Laminas\Diactoros\Response\RedirectResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class LegacyRedirectHandler implements RequestHandlerInterface
{
    private CardRepository $cardRepository;

    public function __construct(CardRepository $cardRepository)
    {
        $this->cardRepository = $cardRepository;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
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
