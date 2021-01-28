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

    public function provideGetSite(): array
    {
        return [
            'empty default to dilps' => ['', SiteType::DILPS],
            'default to dilps' => ['unknown string', SiteType::DILPS],
            'local dilps' => ['dilps.lan', SiteType::DILPS],
            'production-like dilps' => ['dilps.com', SiteType::DILPS],
            'local tiresias' => ['tiresias.lan', SiteType::TIRESIAS],
            'production-like tiresias' => ['tiresias.com', SiteType::TIRESIAS],
            'staging-like tiresias' => ['www.tiresias-staging.example.com', SiteType::TIRESIAS],
        ];
    }
}
