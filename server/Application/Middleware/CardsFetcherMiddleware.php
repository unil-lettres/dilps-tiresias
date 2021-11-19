<?php

declare(strict_types=1);

namespace Application\Middleware;

use Application\Repository\CardRepository;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class CardsFetcherMiddleware extends AbstractMiddleware
{
    private CardRepository $cardRepository;

    public function __construct(CardRepository $cardRepository)
    {
        $this->cardRepository = $cardRepository;
    }

    /**
     * Fetch multiples cards from their ID.
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $ids = explode(',', $request->getAttribute('ids'));

        $cards = $this->cardRepository->findById($ids);
        if (!$cards) {
            return $this->createError('No cards found in database for any of the ids: ' . implode(', ', $ids));
        }

        return $handler->handle($request->withAttribute('cards', $cards));
    }
}
