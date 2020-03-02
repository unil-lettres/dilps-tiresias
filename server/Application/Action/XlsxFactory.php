<?php

declare(strict_types=1);

namespace Application\Action;

use Interop\Container\ContainerInterface;

class XlsxFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $site = $container->get('site');

        return new XlsxAction($site);
    }
}
