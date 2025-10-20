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
        $sanitized = self::noUnbreakableSpaces(strip_tags($string, '<p><br><strong><em><u>'));

        return $sanitized;
    }

    public static function noUnbreakableSpaces(string $string): string
    {
        return str_replace(['&nbsp;', html_entity_decode('&nbsp;')], ' ', $string);
    }

    public static function sanitizeSingleLineRichText(string $string): string
    {
        $sanitized = self::noUnbreakableSpaces(strip_tags($string, '<strong><em><u>'));

        return $sanitized;
    }

    public static function richTextToPlainText(string $string): string
    {
        return mb_trim(self::noUnbreakableSpaces(html_entity_decode(strip_tags(preg_replace(
            [
                '~<br\s*/?>~i',
                '~<p\s*>~i',
                '~</p\s*>~i',
                '~\n{2,}~i',
            ],
            [
                "\n",
                "\n\n",
                "\n\n",
                "\n\n",
            ],
            $string,
        )))));
    }

    public static function formatMetric(int|float $value): string
    {
        foreach ([
            'T' => 1_000_000_000_000,
            'G' => 1_000_000_000,
            'M' => 1_000_000,
            'k' => 1_000,
        ] as $metric => $limit) {
            if ($value >= $limit) {
                $string = (string) ($value / $limit);
                if (str_contains($string, '.')) {
                    $string = mb_rtrim($string, '0');
                }

                return $string . $metric;
            }
        }

        return (string) $value;
    }
}
