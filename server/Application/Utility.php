<?php

declare(strict_types=1);

namespace Application;

use DateTimeImmutable;
use DateTimeZone;

abstract class Utility
{
    /**
     * @var DateTimeImmutable
     */
    private static $now;

    /**
     * Returns now, always same value for a single PHP execution
     *
     * @return DateTimeImmutable
     */
    public static function getNow(): DateTimeImmutable
    {
        if (!self::$now) {
            self::$now = new DateTimeImmutable();
        }

        return self::$now;
    }

    /**
     * Returns the short class name of any object, eg: Application\Model\Calendar => Calendar
     *
     * @param object $object
     *
     * @return string
     */
    public static function getShortClassName($object): string
    {
        $reflect = new \ReflectionClass($object);

        return $reflect->getShortName();
    }

    /**
     * Print a list of files if non empty
     *
     * @param string $title
     * @param array $files
     */
    public static function printFiles(string $title, array $files): void
    {
        if (!$files) {
            return;
        }

        echo $title . PHP_EOL . PHP_EOL;

        foreach ($files as $file) {
            echo '    ' . escapeshellarg($file) . PHP_EOL;
        }
        echo PHP_EOL;
    }

    public static function dateToJulian(DateTimeImmutable $date): int
    {
        return gregoriantojd((int) $date->format('m'), (int) $date->format('d'), (int) $date->format('Y'));
    }

    public static function julianToDate(int $date): DateTimeImmutable
    {
        $parts = explode('/', jdtogregorian($date));

        $result = new DateTimeImmutable('now', new DateTimeZone('UTC'));

        return $result->setDate((int) $parts[2], (int) $parts[0], (int) $parts[1])->setTime(0, 0, 0, 0);
    }

    public static function sanitizeRichText(string $string): string
    {
        $sanitized = strip_tags($string, '<p><br><strong><em><u>');

        return $sanitized;
    }

    public static function sanitizeSingleLineRichText(string $string): string
    {
        $sanitized = strip_tags($string, '<strong><em><u>');

        return $sanitized;
    }
}
