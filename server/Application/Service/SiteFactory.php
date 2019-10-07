<?php

declare(strict_types=1);

namespace Application\Service;

use Application\DBAL\Types\SiteType;
use Interop\Container\ContainerInterface;
use Psr\Http\Message\ServerRequestInterface;
use Zend\Expressive\Container\ServerRequestFactoryFactory;

class SiteFactory
{
    /**
     * Return the current site, dilps or tiresias, from the request host name
     *
     * @param ContainerInterface $container
     *
     * @return ImageService
     */
    public function __invoke(ContainerInterface $container): string
    {
        /** @var ServerRequestFactoryFactory $imagine */
        $imagine = $container->get(ServerRequestInterface::class);
        /** @var ServerRequestInterface $request */
        $request = $imagine();

        $serverName = $request->getServerParams()['SERVER_NAME'] ?? 'dilps.lan';

        if (preg_match('~tiresias~', $serverName)) {
            $site = SiteType::TIRESIAS;
        } else {
            $site = SiteType::DILPS;
        }

        return $site;
    }
}
