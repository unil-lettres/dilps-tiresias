<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Collection;
use Application\Repository\CollectionRepository;
use ApplicationTest\Repository\Traits\LimitedAccessSubQuery;

/**
 * @group Repository
 */
class CollectionRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    /**
     * @var CollectionRepository
     */
    private $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Collection::class);
    }

    public function providerGetAccessibleSubQuery(): array
    {
        return [
            ['anonymous', []],
            ['student', [2000, 2001, 2002, 2004, 2005, 2006, 2007, 2008]],
            ['junior', [2001, 2002, 2004, 2005, 2007]],
            ['senior', [2001, 2002, 2004, 2005, 2007]],
            ['administrator', [2001, 2002, 2004, 2005, 2007]],
        ];
    }
}
