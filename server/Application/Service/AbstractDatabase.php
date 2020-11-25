<?php

declare(strict_types=1);

namespace Application\Service;

use Exception;

/**
 * Tool to reload the entire local database from remote database for a given site
 * Requirements:
 * - ssh access to remote server (via ~/.ssh/config)
 * - both local and remote sites must be accesible via: /sites/MY_SITE
 */
abstract class AbstractDatabase
{
    /**
     * Dump data from database on $remote server
     *
     * @param string $remote
     * @param string $dumpFile path
     */
    private static function dumpDataRemotely($remote, $dumpFile): void
    {
        $sshCmd = <<<STRING
                    ssh $remote "cd /sites/$remote/ && php7.4 bin/dump-data.php $dumpFile"
            STRING;

        echo "dumping data $dumpFile on $remote...\n";
        self::executeLocalCommand($sshCmd);
    }

    /**
     * Dump data from database
     *
     * @param string $dumpFile path
     */
    public static function dumpData($dumpFile): void
    {
        $mysqlArgs = self::getMysqlArgs();

        echo "dumping $dumpFile...\n";
        $dumpCmd = "mysqldump -v $mysqlArgs | gzip > $dumpFile";
        self::executeLocalCommand($dumpCmd);
    }

    /**
     * Copy a file from $remote
     *
     * @param string $remote
     * @param string $dumpFile
     */
    private static function copyFile($remote, $dumpFile): void
    {
        $copyCmd = <<<STRING
                    rsync -avz --progress $remote:$dumpFile $dumpFile
            STRING;

        echo "copying dump to $dumpFile ...\n";
        self::executeLocalCommand($copyCmd);
    }

    /**
     * Load SQL dump in local database
     *
     * @param string $dumpFile
     */
    public static function loadData($dumpFile): void
    {
        $mysqlArgs = self::getMysqlArgs();

        $dumpFile = realpath($dumpFile);
        echo "loading dump $dumpFile...\n";
        if (!is_readable($dumpFile)) {
            throw new Exception("Cannot read dump file \"$dumpFile\"");
        }

        self::executeLocalCommand(PHP_BINARY . ' ./vendor/bin/doctrine orm:schema-tool:drop --ansi --full-database --force');
        self::executeLocalCommand("gunzip -c \"$dumpFile\" | mysql $mysqlArgs");
        self::executeLocalCommand(PHP_BINARY . ' ./vendor/bin/doctrine-migrations --ansi migrations:migrate --no-interaction');
    }

    private static function getMysqlArgs(): string
    {
        $dbConfig = _em()->getConnection()->getParams();

        $host = $dbConfig['host'] ?? 'localhost';
        $username = $dbConfig['user'];
        $database = $dbConfig['dbname'];
        $password = $dbConfig['password'];
        $port = $dbConfig['port'] ?? 3306;

        // It's possible to have no password at all
        $password = $password ? '-p' . $password : '';

        return "--user=$username $password --host=$host --port=$port $database";
    }

    public static function loadRemoteData($remote): void
    {
        $dumpFile = "/tmp/$remote." . exec('whoami') . '.backup.gz';
        self::dumpDataRemotely($remote, $dumpFile);
        self::copyFile($remote, $dumpFile);
        self::loadData($dumpFile);

        echo "database updated\n";
    }

    /**
     * Execute a shell command and throw exception if fails
     *
     * @param string $command
     */
    public static function executeLocalCommand($command): void
    {
        $return_var = null;
        $fullCommand = "$command 2>&1";
        passthru($fullCommand, $return_var);
        if ($return_var) {
            throw new Exception('FAILED executing: ' . $command);
        }
    }
}
