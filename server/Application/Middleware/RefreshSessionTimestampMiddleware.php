<?php

declare(strict_types=1);

namespace Application\Middleware;

use Mezzio\Session\SessionMiddleware;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Middleware that writes to the session if a user is connected,
 * in order to refresh the mtime of the session file.
 *
 * If the Mezzio setting non_locking is set to true (i.e., PHP's read_and_close()),
 * the session may be garbage collected even if it was accessed within gc_maxlifetime.
 * This happens because PHP relies on the mtime of the session file,
 * which is updated only when the session is written.
 *
 * As a result, users may be randomly logged out.
 *
 * So as long as the user is connected, we write an arbitrary data to the
 * session to update the mtime of the file to prevent its garbage collection.
 */
class RefreshSessionTimestampMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $session = $request->getAttribute(SessionMiddleware::SESSION_ATTRIBUTE);

        if ($session->has('user')) {
            // Setting a value to trigger session write.
            // Harmless if set twice by concurrent requests.
            $session->set('_last_access', time());
        }

        return $handler->handle($request);
    }
}
