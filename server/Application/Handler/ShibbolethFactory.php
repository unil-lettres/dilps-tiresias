<?php

declare(strict_types=1);

namespace Application\Handler;

use Psr\Container\ContainerInterface;

class ShibbolethFactory
{
    public function __invoke(ContainerInterface $container): ShibbolethHandler
    {
        return new ShibbolethHandler($container);
    }
}
