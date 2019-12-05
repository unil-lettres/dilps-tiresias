<?php

declare(strict_types=1);

namespace Application\Action;

use Psr\Http\Server\MiddlewareInterface;
use Zend\Diactoros\Response\JsonResponse;

abstract class AbstractAction implements MiddlewareInterface
{
    /**
     * @param string $message
     *
     * @return JsonResponse
     */
    protected function createError(string $message): JsonResponse
    {
        $response = new JsonResponse(['error' => $message]);

        return $response->withStatus(404, $message);
    }
}
