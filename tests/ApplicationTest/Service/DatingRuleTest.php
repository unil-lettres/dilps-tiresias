<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\Model\Dating;
use Application\Service\DatingRule;
use PHPUnit\Framework\TestCase;

class DatingRuleTest extends TestCase
{
    public function providerCompute(): iterable
    {
        yield 'empty' => ['', []];
        yield 'simple' => ['1295-2295', [['1295-01-01', '2295-12-31']]];
        yield 'multiple' => ['1295-2295; 1300', [['1295-01-01', '2295-12-31'], ['1300-01-01', '1300-12-31']]];
        yield 'roman' => ['VIII', [['0701-01-01', '0800-12-31']]];
        yield 'roman with extra' => ['XVIIIème siècle', [['1701-01-01', '1800-12-31']]];
        yield 'roman ranges' => ['XVIIe-XVIIIe siècle', [['1601-01-01', '1700-12-31'], ['1701-01-01', '1800-12-31']]];
        yield ['64', [['1964-01-01', '1964-12-31']]];
        yield ['1875-1877', [['1875-01-01', '1877-12-31']]];
        yield ['1875-77', [['1875-01-01', '1877-12-31']]];
        yield ['1875/77', [['1875-01-01', '1877-12-31']]];
        yield ['1875 v. Chr.', [['-1875-01-01', '-1875-12-31']]];
        yield ['1875-1877', [['1875-01-01', '1877-12-31']]];
        yield ['1875 n. Chr.', [['1875-01-01', '1875-12-31']]];
        yield ['1875', [['1875-01-01', '1875-12-31']]];
        yield ['1876-1872 v. Chr.', [['-1876-01-01', '-1872-12-31']]];
        yield ['um 1875 v. Chr.', [['-1875-01-01', '-1875-12-31']]];
        yield ['vor 1875 v. Chr.', [['-1875-01-01', '-1875-12-31']]];
        yield ['nach 1875 v. Chr.', [['-1875-01-01', '-1875-12-31']]];
        yield ['23.10.2003', [['2003-10-23', '2003-10-23']]];
        yield ['spätantike', [['0275-01-01', '0525-12-31']]];
        yield ['Shang-Dynastie', [['-1625-01-01', '-0975-12-31']]];
        yield ['um 1875 v. Chr.', [['-1875-01-01', '-1875-12-31']]];
        yield ['antike ', [['-0825-01-01', '0525-12-31']]];
        yield ['6. Jhdt.', [['0500-01-01', '0599-12-31']]];
        yield ['6 Jhd  n. Chr', [['0500-01-01', '0599-12-31']]];
        yield ['6 Jh. n. Chr.', [['0500-01-01', '0599-12-31']]];
        yield ['um 1874', [['1873-01-01', '1875-12-31']]];
        yield ['Anfang 6. Jhdt.', [['0500-01-01', '0525-12-31']]];
        yield ['6. Jhdt. v. Chr.', [['-0501-01-01', '-0600-12-31']]];
        yield ['6. Jhdt. n. Chr.', [['0500-01-01', '0599-12-31']]];
        yield ['Ende 6. Jhdt.', [['0575-01-01', '0599-12-31']]];
        yield ['vor 1874', [['1874-01-01', '1874-12-31']]];
        yield ['mitte 6. Jhdt.', [['0533-01-01', '0566-12-31']]];
        yield ['mitte 6. Jhdt. v. chr', [['-0666-01-01', '-0633-12-31']]];
        yield ['um 6. Jhdt.', [['0480-01-01', '0620-12-31']]];
        yield ['nach 1874', [['1874-01-01', '1874-12-31']]];
        yield ['1. - 2. Jh. n. Chr.', [['0001-01-01', '0199-12-31']]];
        yield ['2. - 1. Jh. v. Chr.', [['-0200-01-01', '-0001-12-31']]];
    }

    /**
     * @dataProvider providerCompute
     */
    public function testCompute(string $input, array $expected): void
    {
        $datingRule = new DatingRule();
        $actual = $datingRule->compute($input);

        $actualFlat = [];
        foreach ($actual as $a) {
            self::assertInstanceOf(Dating::class, $a);
            $actualFlat[] = [$a->getFrom()->format('Y-m-d'), $a->getTo()->format('Y-m-d')];
        }

        self::assertEquals($expected, $actualFlat);
    }
}
