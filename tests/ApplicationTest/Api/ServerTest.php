<?php

declare(strict_types=1);

namespace ApplicationTest\Api;

use Application\Api\Schema;
use Application\Api\Server;
use Application\Enum\Site;
use Application\Model\User;
use Application\Repository\UserRepository;
use ApplicationTest\Traits\TestWithTransaction;
use Ecodev\Felix\Testing\Api\AbstractServer;

class ServerTest extends AbstractServer
{
    use TestWithTransaction;

    protected function setCurrentUser(?string $user): void
    {
        /** @var UserRepository $userRepository */
        $userRepository = _em()->getRepository(User::class);
        User::setCurrent($userRepository->getOneByLogin($user, Site::Dilps));
    }

    protected function createSchema(): \GraphQL\Type\Schema
    {
        return new Schema();
    }

    protected function createServer(): \Ecodev\Felix\Api\Server
    {
        return new Server(true, Site::Dilps);
    }
}
