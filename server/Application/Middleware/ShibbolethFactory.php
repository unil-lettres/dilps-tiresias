<?php

declare(strict_types=1);

namespace Application\Middleware;

use Interop\Container\ContainerInterface;

class ShibbolethFactory
{
    public function __invoke(ContainerInterface $container): ShibbolethMiddleware
    {
        return new ShibbolethMiddleware($container);
    }
}
