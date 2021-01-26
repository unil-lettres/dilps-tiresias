#! /usr/bin/env php
<?php

/**
 * A script to run a GraphQL query and print result as JSON
 * This is useful to introspect the entire schema for JS unit tests
 */
use Application\Api\Server;
use Application\DBAL\Types\SiteType;
use Laminas\Diactoros\ServerRequest;
use Mezzio\Session\Session;
use Mezzio\Session\SessionMiddleware;

require_once 'server/cli.php';

$server = new Server(true, SiteType::DILPS);
$request = new ServerRequest();
$request = $request->withMethod('POST')->withHeader('content-type', 'application/json')->withParsedBody([
    'query' => $argv[1] ?? '',
    'variables' => json_decode($argv[2] ?? '{}', true),
])->withAttribute(SessionMiddleware::SESSION_ATTRIBUTE, new Session([]));

$result = $server->execute($request);
$server->sendCli($result);
