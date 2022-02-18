<?php

declare(strict_types=1);

namespace Application\Middleware;

use Application\Repository\CardRepository;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class CollectionFetcherMiddleware extends AbstractMiddleware
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

        $cards = $this->cardRepository->getFindAllByCollections($ids)->getQuery()->getResult();
        if (!$cards) {
            return $this->createError('No cards found in database for the collection with ids: ' . implode(', ', $ids));
        }

        return $handler->handle($request->withAttribute('cards', $cards));
    }
}
