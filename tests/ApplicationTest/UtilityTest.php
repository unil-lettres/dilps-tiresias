<?php

declare(strict_types=1);

namespace ApplicationTest;

use Application\Model\User;
use Application\Utility;

class UtilityTest extends \PHPUnit\Framework\TestCase
{
    public function testNow(): void
    {
        self::assertStringStartsWith('202', Utility::getNow()->format('c'));
    }

    public function testGetShortClassName(): void
    {
        self::assertSame('User', Utility::getShortClassName(new User()));
    }
}
