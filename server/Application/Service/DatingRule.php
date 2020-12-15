<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Model\Dating;
use Cake\Chronos\Chronos;

class DatingRule
{
    private array $replace = [
        '/zwischen[[:space:]]*([[:digit:]\.]+)[[:space:]]*(und|-)/' => '$1 - ',
        '/[[:space:]]*\(.*\)[[:space:]]*/' => '',
        '/(around|ca\.?|~|begonnen|ab|vor|nach)/' => '',
        '/(jahrhunderts?|jhd?t?s?\.?)/' => 'jh',
        '/(v\.|vor)[[:space:]]*(christus|chr?\.?)/' => 'vor chr',
        '/(n\.|nach)[[:space:]]*chr\.?/' => '',
        '/(\/|bis)/' => '-',
        '/[[:space:]]+/' => ' ',
        '/erstes/' => '1',
        '/fr(ä|ue|u)hes/' => 'anfang',
        '/sp(ä|ae|a)tes/' => 'ende',
        '/(gegen|vollendet)/' => 'vor',
        '/letztes[[:space:]]*viertel/' => '4. viertel',
        '/letztes[[:space:]]*drittel/' => '3. drittel',
        '/(u\.|und|bzw\.?|oder)/' => ';',
    ];

    /**
     * @return Dating[]
     */
    public function compute(string $input): array
    {
        $romanReplaced = $this->replaceRoman($input);
        $replaced = trim(preg_replace(array_keys($this->replace), array_values($this->replace), mb_strtolower($romanReplaced)));
        $dates = explode(';', $replaced);
        $result = [];
        foreach ($dates as $date) {
            foreach ($this->getMatches() as $pattern => $callbacks) {
                $match = [];
                if (preg_match($pattern, $date, $match)) {
                    $dating = new Dating();
                    $dating->setFrom($callbacks['from']($match));
                    $dating->setTo($callbacks['to']($match));
                    $result[] = $dating;

                    break;
                }
            }
        }

        return $result;
    }

    /**
     * Replace roman number into numeric
     *
     * This use hardcoded Roman numbers as seen in old Dilps
     */
    private function replaceRoman(string $input): string
    {
        $romain = ['XXI', 'XX', 'XIX', 'XVIII', 'XVII', 'XVI', 'XV', 'XIV', 'XIII', 'XII', 'XI', 'X', 'IX', 'VIII', 'VII', 'VI', 'V', 'IV', 'III', 'II', 'I'];
        $numeric = ['2001-2100', '1901-2000', '1801-1900', '1701-1800', '1601-1700', '1501-1600', '1401-1500', '1301-1400', '1201-1300', '1101-1200', '1001-1100', '901-1000', '801-900', '701-800', '601-700', '501-600', '401-500', '301-400', '201-300', '101-200', '1-100'];

        $numeric = array_map(function ($a) {
            return ';' . $a . ';';
        }, $numeric);

        return str_replace($romain, $numeric, $input);
    }

    /**
     * Create a DateTime but force year 1 instead of year 0
     */
    private static function toDateTime(int $year, int $month, int $day): Chronos
    {
        if ($year === 0) {
            $year = 1;
        }

        $date = new Chronos();

        return $date->setDate($year, $month, $day);
    }

    private function getMatches(): array
    {
        return [
            // 64 == 1.1.1964 - 31.12.1964
            '/^[[:space:]]*(\d{2})[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime((int) ('19' . $match[1]), 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime((int) ('19' . $match[1]), 12, 31);
                },
            ],
            // 1875-1877 == 1.1.1875 - 31.12.1877
            // 1875-77 == 1.1.1875 - 31.12.1877
            // 1875/77 == 1.1.1875 - 31.12.1877
            '/^[[:space:]]*(um|nach|vor)?[[:space:]]*(\d{3,4})[[:space:]]*-[[:space:]]*(\d{1,4})[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime((int) $match[2], 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime((int) (mb_substr($match[2], 0, max(0, mb_strlen($match[2]) - mb_strlen($match[3]))) . $match[3]), 12, 31);
                },
            ],
            // 1875 v. Chr. == 1.1.-1875 - 31.12.-1875
            '/^[[:space:]]*(\d{3,4})[[:space:]]*vor[[:space:]]chr.?[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime(-(int) $match[1], 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime(-(int) $match[1], 12, 31);
                },
            ],
            // 1875 n. Chr. == 1.1.1875 - 31.12.1875
            // 1875  == 1.1.1875 - 31.12.1875
            '/^[[:space:]]*(\d{3,4})[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime((int) $match[1], 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime((int) $match[1], 12, 31);
                },
            ],
            // 1876-1872 v. Chr. == 1.1.-1876 - 31.12.-1872
            '/^[[:space:]]*(um)?[[:space:]]*(\d+)[[:space:]]*-[[:space:]]*(\d+)[[:space:]]*vor[[:space:]]chr.?[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime(-max((int) $match[2], (int) ($match[3])), 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime(-min((int) $match[2], (int) ($match[3])), 12, 31);
                },
            ],
            // um 1875 v. Chr. == 1.1.-1875 - 31.12.-1875
            '/^[[:space:]]*um[[:space:]]*(\d+)[[:space:]]*vor[[:space:]]chr.?[[:space:]]*(\\(.*\\))?[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime(-(int) $match[1], 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime(-(int) $match[1], 12, 31);
                },
            ],
            // 23.10.2003 == 23.10.2003 - 23.10.2003
            '/^[[:space:]]*(\d{2}).(\d{2}).(\d{4})[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime((int) $match[3], (int) $match[2], (int) ($match[1]));
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime((int) $match[3], (int) $match[2], (int) ($match[1]));
                },
            ],
            // spätantike == 1.1.275 - 31.12.525
            '/^[[:space:]]*spät[[:space:]]*antike[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime(275, 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime(525, 12, 31);
                },
            ],
            // Shang-Dynastie == 16 - 11 Jh. v. Chr
            '/^[[:space:]]*shang[[:space:]-]*dynastie[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime(-1625, 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime(-975, 12, 31);
                },
            ],
            // antike == 1.1.-825 - 31.12.525
            '/^[[:space:]]*antike[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime(-825, 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime(525, 12, 31);
                },
            ],
            // 6. Jhdt.  == 1.1.500 - 31.12.599
            // 6. Jhdt. n Chr. == 1.1.500 - 31.12.599
            // 6 Jh. n. Chr. == 1.1.500 - 31.12.599
            '/^[[:space:]]*(\d{1,2})[.]?[[:space:]]*jh[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime((int) (($match[1] - 1) . '00'), 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime((int) (($match[1] - 1) . '99'), 12, 31);
                },
            ],
            // um 1874 == 1873 - 1875
            '/^[[:space:]]*um[[:space:]]*(\d{3,4})[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime((int) ($match[1]) - 1, 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime((int) ($match[1]) + 1, 12, 31);
                },
            ],
            // Anfang 6. Jhdt. == 1.1.500 - 31.12.525
            '/^[[:space:]]*anf(ang)?.?([[:space:]]*des)?[[:space:]]*(\d{1,2})[.]?[[:space:]]*jh[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime((int) (((int) ($match[3]) - 1) . '00'), 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime((int) (((int) ($match[3]) - 1) . '25'), 12, 31);
                },
            ],
            // 6. Jhdt. v. Chr. == 1.1.-501 - 31.12.-600
            '/^[[:space:]]*(\d{1,2})[.]?[[:space:]]*jh[[:space:]]*vor[[:space:]]*chr.?[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime(-(int) (($match[1] - 1) . '01'), 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime(-(int) ($match[1] . '00'), 12, 31);
                },
            ],
            // 6. Jhdt. n. Chr. == 1.1.500 - 31.12.599
            '/^[[:space:]]*(um|nach|vor)?[[:space:]]*(\d{1,2}).?[[:space:]]*-[[:space:]]*(\d{1,2}).?[[:space:]]*jh[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime((int) (($match[2] - 1) . '00'), 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime((int) (((int) ($match[3]) - 1) . '99'), 12, 31);
                },
            ],
            // Ende 6. Jhdt. == 1.1.575 - 31.12.599
            '/^[[:space:]]*ende([[:space:]]*des)?[[:space:]]*(\d{1,2})[.]?[[:space:]]*jh[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime((int) (($match[2] - 1) . '75'), 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime((int) (($match[2] - 1) . '99'), 12, 31);
                },
            ],
            // mitte 6. Jhdt. == 1.1.533 - 31.12.566
            '/^[[:space:]]*mitte[[:space:]]*(des[[:space:]]*)?(\d{1,2})[.]?[[:space:]]*jh[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime((int) (($match[2] - 1) . '33'), 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime((int) (($match[2] - 1) . '66'), 12, 31);
                },
            ],
            // mitte 6. Jhdt. v. chr == -0666-01-01 - -0633-12-31
            '/^[[:space:]]*mitte[[:space:]]*(des[[:space:]]*)?(\d{1,2})[.]?[[:space:]]*jh[[:space:]]*vor[[:space:]]chr.?[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime(-(int) ($match[2] . '00') - 66, 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime(-(int) ($match[2] . '00') - 33, 12, 31);
                },
            ],
            // um 6. Jhdt.  == 1.1.480 - 31.12.620
            '/^[[:space:]]*um[[:space:]]*(\d{1,2})[.]?[[:space:]]*jh[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime((int) (($match[1] - 1) . '00') - 20, 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime((int) (($match[1] - 1) . '00') + 120, 12, 31);
                },
            ],
            // 2. - 1. Jh. v. Chr. == -0200-01-01 - -0001-12-31
            '/^[[:space:]]*(um|nach|vor)?[[:space:]]*(\d{1,2}).?[[:space:]]*-[[:space:]]*(\d{1,2}).?[[:space:]]*jh[[:space:]]*vor[[:space:]]*chr.?[[:space:]]*(\\(.*\\))?[[:space:]]*$/' => [
                'from' => function (array $match): Chronos {
                    return self::toDateTime(-(int) ((max((int) $match[2], (int) ($match[3]))) . '00'), 1, 1);
                },
                'to' => function (array $match): Chronos {
                    return self::toDateTime(-(int) ((min((int) $match[2], (int) ($match[3])) - 1) . '01'), 12, 31);
                },
            ],

        ];
    }
}
