<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use ApplicationTest\Traits\TestWithTransaction;
use PHPUnit\Framework\TestCase;

abstract class AbstractRepositoryTest extends TestCase
{
    use TestWithTransaction;
}
