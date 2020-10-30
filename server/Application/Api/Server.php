<?php

declare(strict_types=1);

namespace Application\Api;

use GraphQL\Error\DebugFlag;
use GraphQL\Executor\ExecutionResult;
use GraphQL\GraphQL;
use GraphQL\Server\ServerConfig;
use GraphQL\Server\StandardServer;
use Mezzio\Session\SessionMiddleware;
use Psr\Http\Message\ServerRequestInterface;

/**
 * A thin wrapper to serve GraphQL via HTTP or CLI
 */
class Server
{
    private $server;

    /**
     * @var ServerConfig
     */
    private $config;

    public function __construct(bool $debug, string $site)
    {
        GraphQL::setDefaultFieldResolver(new DefaultFieldResolver());
        $this->config = ServerConfig::create([
            'schema' => new Schema(),
            'queryBatching' => true,
            'debugFlag' => $debug ? DebugFlag::INCLUDE_DEBUG_MESSAGE | DebugFlag::INCLUDE_TRACE : DebugFlag::NONE,
            'rootValue' => $site,
        ]);
        $this->server = new StandardServer($this->config);
    }

    public function execute(ServerRequestInterface $request): ExecutionResult
    {
        if (!$request->getParsedBody()) {
            $request = $request->withParsedBody(json_decode($request->getBody()->getContents(), true));
        }

        // Set current session as the only context we will ever need
        $session = $request->getAttribute(SessionMiddleware::SESSION_ATTRIBUTE);
        $this->config->setContext($session);

        return $this->server->executePsrRequest($request);
    }

    /**
     * Send response to CLI
     */
    public function sendCli(ExecutionResult $result): void
    {
        echo json_encode($result, JSON_PRETTY_PRINT) . PHP_EOL;
    }
}
