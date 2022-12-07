<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\DBAL\Types\SiteType;
use Application\Service\SiteFactory;
use PHPUnit\Framework\TestCase;

class SiteFactoryTest extends TestCase
{
    /**
     * @dataProvider provideGetSite
     */
    public function testGetSite(string $input, string $expected): void
    {
        self::assertSame($expected, SiteFactory::getSite($input));
    }

    public function provideGetSite(): iterable
    {
        yield 'empty default to dilps' => ['', SiteType::DILPS];
        yield 'default to dilps' => ['unknown string', SiteType::DILPS];
        yield 'local dilps' => ['dilps.lan', SiteType::DILPS];
        yield 'production-like dilps' => ['dilps.com', SiteType::DILPS];
        yield 'local tiresias' => ['tiresias.lan', SiteType::TIRESIAS];
        yield 'production-like tiresias' => ['tiresias.com', SiteType::TIRESIAS];
        yield 'staging-like tiresias' => ['www.tiresias-staging.example.com', SiteType::TIRESIAS];
    }
}
