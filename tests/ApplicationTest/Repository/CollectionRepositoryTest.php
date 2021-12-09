<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Card;
use Application\Model\Collection;
use Application\Repository\CollectionRepository;
use ApplicationTest\Repository\Traits\LimitedAccessSubQuery;

class CollectionRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    private CollectionRepository $repository;

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

    /**
     * @dataProvider providerGetCopyrights
     */
    public function testGetCopyrights(int $input, string $expected): void
    {
        $card = $this->createMock(Card::class);
        $card->expects(self::once())->method('getId')->willReturn($input);

        $actual = $this->repository->getCopyrights($card);
        self::assertSame($expected, $actual);
    }

    public function providerGetCopyrights(): array
    {
        return [
            [6000, '© ACME (Only if you ask nicely)'],
            [6001, ''],
        ];
    }
}
