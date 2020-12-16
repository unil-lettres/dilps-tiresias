<?php

declare(strict_types=1);

namespace Application\Middleware;

use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Server\MiddlewareInterface;

abstract class AbstractMiddleware implements MiddlewareInterface
{
    protected function createError(string $message): ResponseInterface
    {
        $response = new JsonResponse(['error' => $message]);

        return $response->withStatus(404, $message);
    }
}
