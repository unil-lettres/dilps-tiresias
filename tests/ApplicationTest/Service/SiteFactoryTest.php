<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\Enum\Site;
use Application\Service\SiteFactory;
use PHPUnit\Framework\TestCase;

class SiteFactoryTest extends TestCase
{
    /**
     * @dataProvider provideGetSite
     */
    public function testGetSite(string $input, Site $expected): void
    {
        self::assertSame($expected, SiteFactory::getSite($input));
    }

    public function provideGetSite(): iterable
    {
        yield 'empty default to dilps' => ['', Site::Dilps];
        yield 'default to dilps' => ['unknown string', Site::Dilps];
        yield 'local dilps' => ['dilps.lan', Site::Dilps];
        yield 'production-like dilps' => ['dilps.com', Site::Dilps];
        yield 'local tiresias' => ['tiresias.lan', Site::Tiresias];
        yield 'production-like tiresias' => ['tiresias.com', Site::Tiresias];
        yield 'staging-like tiresias' => ['www.tiresias-staging.example.com', Site::Tiresias];
    }
}
