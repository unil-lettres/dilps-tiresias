<?php

declare(strict_types=1);

namespace Application\Service;

use Application\DBAL\Types\SiteType;
use Interop\Container\ContainerInterface;
use Psr\Http\Message\ServerRequestInterface;

class SiteFactory
{
    /**
     * Return the current site, dilps or tiresias, from the request host name
     *
     * @param ContainerInterface $container
     *
     * @return string
     */
    public function __invoke(ContainerInterface $container): string
    {
        /** @var callable $requestFactory */
        $requestFactory = $container->get(ServerRequestInterface::class);
        /** @var ServerRequestInterface $request */
        $request = $requestFactory();

        $serverName = $request->getServerParams()['SERVER_NAME'] ?? 'dilps.lan';

        if (preg_match('~tiresias~', $serverName)) {
            $site = SiteType::TIRESIAS;
        } else {
            $site = SiteType::DILPS;
        }

        return $site;
    }
}
