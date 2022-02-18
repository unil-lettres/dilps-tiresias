<?php

declare(strict_types=1);

namespace Application\Middleware;

use Application\Repository\CardRepository;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class CardsFetcherMiddleware extends AbstractMiddleware
{
    public function __construct(private readonly CardRepository $cardRepository)
    {
    }

    /**
     * Fetch multiples cards from their ID.
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $ids = explode(',', (string) $request->getAttribute('ids'));

        $cards = $this->cardRepository->findById($ids);
        if (!$cards) {
            return $this->createError('No cards found in database for any of the ids: ' . implode(', ', $ids));
        }

        return $handler->handle($request->withAttribute('cards', $cards));
    }
}
