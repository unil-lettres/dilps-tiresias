<?php

declare(strict_types=1);

namespace Application\Middleware;

class RefreshSessionTimestampMiddlewareFactory
{
    public function __invoke(): RefreshSessionTimestampMiddleware
    {
        return new RefreshSessionTimestampMiddleware();
    }
}
