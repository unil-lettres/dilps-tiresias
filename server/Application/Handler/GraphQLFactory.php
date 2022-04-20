<?php

declare(strict_types=1);

namespace Application\Handler;

use Application\Api\Server;
use Ecodev\Felix\Handler\GraphQLHandler;
use Psr\Container\ContainerInterface;

class GraphQLFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $site = $container->get('site');
        $server = new Server(true, $site);

        return new GraphQLHandler($server);
    }
}
