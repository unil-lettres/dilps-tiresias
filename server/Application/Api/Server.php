<?php

declare(strict_types=1);

namespace Application\Api;

/**
 * A thin wrapper to serve GraphQL via HTTP or CLI
 */
class Server extends \Ecodev\Felix\Api\Server
{
    public function __construct(bool $debug, string $site)
    {
        parent::__construct(new Schema(), $debug, ['site' => $site]);
    }
}
