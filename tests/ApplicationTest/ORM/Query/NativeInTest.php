<?php

declare(strict_types=1);

namespace ApplicationTest\ORM\Query;

use Application\Model\User;
use Application\ORM\Query\NativeIn;
use PHPUnit\Framework\TestCase;

class NativeInTest extends TestCase
{
    public function providerNativeIn(): iterable
    {
        yield 'normal with string' => [
            'SELECT u.id FROM Application\Model\User u WHERE ' . NativeIn::dql('u.id', "SELECT '123'"),
            "SELECT u0_.id AS id_0 FROM user u0_ WHERE u0_.id IN (SELECT '123') = 1",
        ];
        yield 'negative with string' => [
            'SELECT u.id FROM Application\Model\User u WHERE ' . NativeIn::dql('u.id', "SELECT '123'", true),
            "SELECT u0_.id AS id_0 FROM user u0_ WHERE u0_.id NOT IN (SELECT '123') = 1",
        ];
        yield 'complex' => [
            'SELECT u.id FROM Application\Model\User u WHERE ' . NativeIn::dql('u.id', 'SELECT checklist.id FROM checklist JOIN chapter ON chapter.idChecklist = checklist.id AND chapter.id = 1'),
            'SELECT u0_.id AS id_0 FROM user u0_ WHERE u0_.id IN (SELECT checklist.id FROM checklist JOIN chapter ON chapter.idChecklist = checklist.id AND chapter.id = 1) = 1',
        ];
    }

    /**
     * @dataProvider providerNativeIn
     */
    public function testNativeIn(string $dql, string $expected): void
    {
        $query = _em()->createQuery($dql);
        $actual = _em()->getRepository(User::class)->getAclFilter()->runWithoutAcl(fn () => $query->getSQL());

        self::assertSame($expected, $actual);
    }
}
