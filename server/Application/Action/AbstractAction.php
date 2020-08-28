<?php

declare(strict_types=1);

namespace Application\Action;

use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Server\MiddlewareInterface;

abstract class AbstractAction implements MiddlewareInterface
{
    protected function createError(string $message): JsonResponse
    {
        $response = new JsonResponse(['error' => $message]);

        return $response->withStatus(404, $message);
    }
}
