<?php

declare(strict_types=1);

namespace Application;

use Cake\Chronos\Chronos;
use DateTimeZone;

abstract class Utility
{
    public static function dateToJulian(Chronos $date): int
    {
        return gregoriantojd((int) $date->format('m'), (int) $date->format('d'), (int) $date->format('Y'));
    }

    public static function julianToDate(int $date): Chronos
    {
        $parts = explode('/', jdtogregorian($date));

        $result = new Chronos('now', new DateTimeZone('UTC'));

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
