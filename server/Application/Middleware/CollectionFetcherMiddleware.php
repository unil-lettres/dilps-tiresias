<?php

declare(strict_types=1);

namespace Application\Middleware;

use Application\Action\AbstractAction;
use Application\Repository\CardRepository;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class CollectionFetcherMiddleware extends AbstractAction implements MiddlewareInterface
{
    /**
     * @var CardRepository
     */
    private $cardRepository;

    public function __construct(CardRepository $cardRepository)
    {
        $this->cardRepository = $cardRepository;
    }

    /**
     * Fetch multiples cards from their ID
     *
     * @param ServerRequestInterface $request
     * @param RequestHandlerInterface $handler
     *
     * @return ResponseInterface
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $ids = explode(',', $request->getAttribute('ids'));

        $cards = $this->cardRepository->getFindAllByCollections($ids)->getQuery()->getResult();
        if (!$cards) {
            return $this->createError('No cards found in database for the collection with ids: ' . implode(', ', $ids));
        }

        return $handler->handle($request->withAttribute('cards', $cards));
    }
}
