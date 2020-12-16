<?php

declare(strict_types=1);

namespace Application\Handler;

use Application\Api\Server;
use Doctrine\ORM\EntityManager;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class GraphQLHandler implements RequestHandlerInterface
{
    private EntityManager $entityManger;

    private string $site;

    public function __construct(EntityManager $entityManager, string $site)
    {
        $this->entityManger = $entityManager;
        $this->site = $site;
    }

    /**
     * Process an incoming server request and return a response, optionally delegating
     * to the next middleware component to create the response.
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $server = new Server(true, $this->site);

        $response = $server->execute($request);

        return new JsonResponse($response);
    }
}
