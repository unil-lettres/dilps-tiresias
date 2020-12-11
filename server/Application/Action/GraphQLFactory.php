<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Api\Server;
use Ecodev\Felix\Action\GraphQLAction;
use Interop\Container\ContainerInterface;

class GraphQLFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $site = $container->get('site');
        $server = new Server(true, $site);

        return new GraphQLAction($server);
    }
}
