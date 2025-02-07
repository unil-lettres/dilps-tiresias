<?php

declare(strict_types=1);

namespace Application\Api;

use Application\Enum\Site;

/**
 * A thin wrapper to serve GraphQL via HTTP or CLI.
 */
class Server extends \Ecodev\Felix\Api\Server
{
    public function __construct(bool $debug, Site $site)
    {
        parent::__construct(new Schema(), $debug, ['site' => $site]);
    }
}
