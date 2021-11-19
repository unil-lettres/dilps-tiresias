<?php

declare(strict_types=1);

namespace Application\Service;

use Application\DBAL\Types\SiteType;
use Interop\Container\ContainerInterface;
use Psr\Http\Message\ServerRequestInterface;

class SiteFactory
{
    /**
     * Return the current site, dilps or tiresias, from the request host name.
     */
    public function __invoke(ContainerInterface $container): string
    {
        /** @var callable $requestFactory */
        $requestFactory = $container->get(ServerRequestInterface::class);
        /** @var ServerRequestInterface $request */
        $request = $requestFactory();

        return self::getSite($request->getServerParams()['SERVER_NAME'] ?? '');
    }

    public static function getSite(string $serverName): string
    {
        if (preg_match('~tiresias~', $serverName)) {
            return SiteType::TIRESIAS;
        }

        return SiteType::DILPS;
    }
}
