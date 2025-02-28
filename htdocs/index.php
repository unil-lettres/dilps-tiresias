<?php

declare(strict_types=1);
// Delegate static file requests back to the PHP built-in webserver
if (PHP_SAPI === 'cli-server'
    && is_file(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))
) {
    return false;
}

chdir(dirname(__DIR__));
require 'vendor/autoload.php';

// Set session max lifetime to 1 minute
ini_set('session.gc_maxlifetime', 60); // 60 seconds

// Make GC run 1% of the time
ini_set('session.gc_probability', 100); 
ini_set('session.gc_divisor', 100);


// session_start(['read_and_close' => true]) does not update the session file's timestamps.

// setting mezzio 'non_locking' => false, will set read_and_close to true.

// the garbage collector script (the one that runs every 24 minutes) won't see any activity on those session files, and will delete them prematurely, assuming they are stale.
// even if the user made requests with this sesison id.

// SOLUTIONS:
// - use DB session ?
// - set session.gc_maxlifestime greater and add a dialog that tell the user it is no longer connected and redirect it on login page ?
//              this will not fix the problem but make it way more rare and obtuse.
// - find a way to update session file timestamp?


class DebugSessionHandler extends SessionHandler
{
    public function write($session_id, $session_data): bool
    {
        // Capture the stack trace
        ob_start();
        debug_print_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
        $trace = ob_get_clean();

        // Log the stack trace into the file
        if (empty($session_data)) {
            file_put_contents('session_log_file.txt', date('Y-m-d H:i:s') . "\ndata: " . $session_data . "\n - Session Write:\n\n" . $trace . "\n", FILE_APPEND);
        } else {
            file_put_contents('session_log_file.txt', date('Y-m-d H:i:s') . "\ndata: " . $session_data. "\n\n", FILE_APPEND);
        }

        // Continue with the default session handler
        return parent::write($session_id, $session_data);
    }
}

$handler = new DebugSessionHandler();
session_set_save_handler($handler, true);


// Self-called anonymous function that creates its own scope and keep the global namespace clean.
(function (): void {
    /** @var \Psr\Container\ContainerInterface $container */
    $container = require 'config/container.php';

    /** @var \Mezzio\Application $app */
    $app = $container->get(\Mezzio\Application::class);
    $factory = $container->get(\Mezzio\MiddlewareFactory::class);

    // Execute programmatic/declarative middleware pipeline and routing
    // configuration statements
    (require 'config/pipeline.php')($app, $factory, $container);
    (require 'config/routes.php')($app, $factory, $container);

    // we only run the application if this file was NOT included (otherwise, the file was included to access misc functions)
    if (realpath(__FILE__) === realpath($_SERVER['SCRIPT_FILENAME'])) {
        $app->run();
    }
})();
