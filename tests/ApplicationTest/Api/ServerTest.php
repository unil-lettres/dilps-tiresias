<?php

declare(strict_types=1);

namespace ApplicationTest\Api;

use Application\Api\Schema;
use Application\Api\Server;
use Application\DBAL\Types\SiteType;
use Application\Model\User;
use ApplicationTest\Traits\TestWithTransaction;
use Ecodev\Felix\Testing\Api\AbstractServer;

class ServerTest extends AbstractServer
{
    use TestWithTransaction;

    protected function setCurrentUser(?string $user): void
    {
        User::setCurrent(_em()->getRepository(User::class)->getOneByLogin($user, SiteType::DILPS));
    }

    protected function createSchema(): \GraphQL\Type\Schema
    {
        return new Schema();
    }

    protected function createServer(bool $debug): \Ecodev\Felix\Api\Server
    {
        return new Server($debug, SiteType::DILPS);
    }
}
