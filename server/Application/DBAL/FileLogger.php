<?php

declare(strict_types=1);

namespace Application\DBAL;

use Doctrine\DBAL\Logging\DebugStack;
use Exception;

/**
 * Writes DB queries as log messages in logs/db.log.
 */
class FileLogger extends DebugStack
{
    private const LOG_FILE = 'logs/db.log';

    public function __construct()
    {
        if (file_exists(self::LOG_FILE) && !is_writable(self::LOG_FILE)) {
            throw new Exception(self::LOG_FILE . ' is not writable');
        }
    }

    public function stopQuery(): void
    {
        if ($this->enabled) {
            parent::stopQuery();

            $this->log($this->queries[$this->currentQuery]);
        }
    }

    /**
     * Log the query to file
     */
    private function log(array $query): void
    {
        $flattenParams = str_replace(PHP_EOL, '', ve($query['params'], true));
        $log = sprintf("%s | %0.6f | %s | %s\n", date('c'), $query['executionMS'], $query['sql'], $flattenParams);

        file_put_contents(self::LOG_FILE, $log, FILE_APPEND);
    }
}
