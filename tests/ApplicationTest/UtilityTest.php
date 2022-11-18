<?php

declare(strict_types=1);

namespace ApplicationTest;

use Application\Utility;
use PHPUnit\Framework\TestCase;

class UtilityTest extends TestCase
{
    /**
     * @dataProvider providerSanitizeRichText
     */
    public function testSanitizeRichText(string $input, string $expected): void
    {
        self::assertSame($expected, Utility::sanitizeRichText($input));
    }

    public function providerSanitizeRichText(): iterable
    {
        yield ['', ''];
        yield [' foo ', ' foo '];
        yield ['foo<div>bar', 'foobar'];
        yield ['<script>script</script><div>div</div><span>span</span><p>p</p><strong>strong</strong><br><em>em</em><u>u</u>', 'scriptdivspan<p>p</p><strong>strong</strong><br><em>em</em><u>u</u>'];
        yield ['&nbsp;' . html_entity_decode('&nbsp;'), chr(32) . chr(32)];
    }

    /**
     * @dataProvider providerSanitizeSingleLineRichText
     */
    public function testSanitizeSingleLineRichText(string $input, string $expected): void
    {
        self::assertSame($expected, Utility::sanitizeSingleLineRichText($input));
    }

    public function providerSanitizeSingleLineRichText(): iterable
    {
        yield ['', ''];
        yield [' foo ', ' foo '];
        yield ['foo<div>bar', 'foobar'];
        yield ['<script>script</script><div>div</div><span>span</span><p>p</p><strong>strong</strong><br><em>em</em><u>u</u>', 'scriptdivspanp<strong>strong</strong><em>em</em><u>u</u>'];
        yield ['&nbsp;' . html_entity_decode('&nbsp;'), chr(32) . chr(32)];
    }

    /**
     * @dataProvider providerRichTextToPlainText
     */
    public function testRichTextToPlainText(string $input, string $expected): void
    {
        self::assertSame($expected, Utility::richTextToPlainText($input));
    }

    public function providerRichTextToPlainText(): iterable
    {
        yield ['', ''];
        yield [' foo ', 'foo'];
        yield ['foo<div>bar', 'foobar'];
        yield ['<p>p</p>scriptdivspan<p>p</p><strong>strong</strong><br>1<br >2<br/>3<br />4<em>em</em><u>u</u><p>p</p>', <<<STRING
            p

            scriptdivspan

            p

            strong
            1
            2
            3
            4emu

            p
            STRING
            ,
        ];
        yield ['&amp;&gt;&lt;&quot;&nbsp;' . html_entity_decode('&nbsp;') . '&#8364;&#x20AC;', '&><"  €€'];
    }
}
