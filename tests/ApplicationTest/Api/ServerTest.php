<?php

declare(strict_types=1);

namespace ApplicationTest\Api;

use Application\Api\Server;
use Application\DBAL\Types\SiteType;
use Application\Model\User;
use ApplicationTest\Traits\TestWithTransaction;
use Laminas\Diactoros\ServerRequest;
use Mezzio\Session\Session;
use Mezzio\Session\SessionMiddleware;
use PHPUnit\Framework\TestCase;

class ServerTest extends TestCase
{
    use TestWithTransaction;

    /**
     * @dataProvider providerQuery
     *
     * @param null|string $user
     * @param ServerRequest $request
     * @param array $expected
     */
    public function testQuery(?string $user, ServerRequest $request, array $expected): void
    {
        User::setCurrent(_em()->getRepository(User::class)->getOneByLogin($user, SiteType::DILPS));

        // Use this flag to easily debug API test issues
        $debug = false;

        // Configure server
        $server = new Server($debug, SiteType::DILPS);

        // Execute query
        $actual = $server->execute($request)->toArray();

        if ($debug) {
            ve($actual);
            unset($actual['errors'][0]['trace']);
        }

        self::assertEquals($expected, $actual);
    }

    public function providerQuery(): array
    {
        $data = [];
        foreach (glob('tests/data/query/*.php') as $file) {
            $name = str_replace('-', ' ', basename($file, '.php'));
            $user = preg_replace('/\d/', '', explode(' ', $name)[0]);
            if ($user === 'anonymous') {
                $user = null;
            }

            $args = require $file;

            // Convert arg into request
            $request = new ServerRequest();
            $args[0] = $request
                ->withMethod('POST')
                ->withHeader('content-type', ['application/json'])
                ->withParsedBody($args[0])
                ->withAttribute(SessionMiddleware::SESSION_ATTRIBUTE, new Session([]));

            array_unshift($args, $user);
            $data[$name] = $args;
        }

        return $data;
    }
}
