<?php

declare(strict_types=1);

namespace ApplicationTest\ORM\Query\Filter;

use Application\DBAL\Types\SiteType;
use Application\Model\Artist;
use Application\Model\Card;
use Application\Model\Change;
use Application\Model\Collection;
use Application\Model\Country;
use Application\Model\Dating;
use Application\Model\Institution;
use Application\Model\Tag;
use Application\Model\User;
use Application\ORM\Query\Filter\AclFilter;
use PHPUnit\Framework\TestCase;

class AclFilterTest extends TestCase
{
    public function providerFilter(): array
    {
        return [
            'country is totally public public class, access everything' => [
                null,
                Country::class,
                '',
            ],
            'artist is totally public public class, access everything' => [
                null,
                Artist::class,
                '',
            ],
            'institution is totally public public class, access everything' => [
                null,
                Institution::class,
                '',
            ],
            'tag is totally public public class, access everything' => [
                null,
                Tag::class,
                '',
            ],
            'dating is totally public public class, access everything' => [
                null,
                Dating::class,
                '',
            ],
            'users are invisible to anonymous' => [
                null,
                User::class,
                'test.id IN (-1)',
            ],
            'users are accessible to any other users' => [
                'student',
                User::class,
                'test.id IN (SELECT',
            ],
            'only public cards are accessible to anonymous' => [
                null,
                Card::class,
                'test.id IN (SELECT card.id FROM card WHERE card.visibility IN (\'public\'))',
            ],
            'student can access cards that are his own or are public or member' => [
                'student',
                Card::class,
                'test.id IN (SELECT card.id FROM card LEFT JOIN collection_card collection_card ON collection_card.card_id = card.id LEFT JOIN collection_user collection_user ON collection_card.collection_id = collection_user.collection_id WHERE (card.visibility IN (\'public\', \'member\')) OR (card.owner_id = \'1003\') OR (card.creator_id = \'1003\') OR (collection_user.user_id = \'1003\'))',
            ],
            'collections are invisible to anonymous' => [
                null,
                Collection::class,
                'test.id IN (-1)',
            ],
            'student can access collections that are his own or are member' => [
                'student',
                Collection::class,
                'test.id IN (WITH RECURSIVE parent AS',
            ],
            'administrator can access collections that are his own or are administrator or member' => [
                'administrator',
                Collection::class,
                'test.id IN (WITH RECURSIVE parent AS',
            ],
            'changes are invisible to anonymous' => [
                null,
                Change::class,
                'test.id IN (-1)',
            ],
            'student can access changes that are his own' => [
                'student',
                Change::class,
                'test.id IN (SELECT `change`.id FROM `change` WHERE `change`.owner_id = \'1003\' OR `change`.creator_id = \'1003\')',
            ],
        ];
    }

    /**
     * @dataProvider providerFilter
     *
     * @param null|string $login
     * @param string $class
     * @param string $expected
     */
    public function testFilter(?string $login, string $class, string $expected): void
    {
        $user = _em()->getRepository(User::class)->getOneByLogin($login, SiteType::DILPS);
        $filter = new AclFilter(_em());
        $filter->setUser($user);
        $targetEntity = _em()->getMetadataFactory()->getMetadataFor($class);
        $actual = $filter->addFilterConstraint($targetEntity, 'test');

        if ($expected === '') {
            self::assertSame($expected, $actual);
        } else {
            self::assertStringStartsWith($expected, $actual);
        }
    }

    public function testDeactivable(): void
    {
        $user = new User();
        $filter = new AclFilter(_em());
        $filter->setUser($user);
        $targetEntity = _em()->getMetadataFactory()->getMetadataFor(User::class);

        $this->assertNotSame('', $filter->addFilterConstraint($targetEntity, 'test'), 'enabled by default');

        $filter->runWithoutAcl(function () use ($filter, $targetEntity): void {
            $this->assertSame('', $filter->addFilterConstraint($targetEntity, 'test'), 'can disable');

            $filter->runWithoutAcl(function () use ($filter, $targetEntity): void {
                $this->assertSame('', $filter->addFilterConstraint($targetEntity, 'test'), 'can disable one more time and still disabled');
            });

            $this->assertSame('', $filter->addFilterConstraint($targetEntity, 'test'), 'enable once and still disabled');
        });

        $this->assertNotSame('', $filter->addFilterConstraint($targetEntity, 'test'), 'enabled a second time and really enabled');
    }

    public function testDisableForever(): void
    {
        $filter = new AclFilter(_em());
        $targetEntity = _em()->getMetadataFactory()->getMetadataFor(User::class);

        $this->assertNotSame('', $filter->addFilterConstraint($targetEntity, 'test'), 'enabled by default');

        $filter->disableForever();
        $this->assertSame('', $filter->addFilterConstraint($targetEntity, 'test'), 'disabled forever');

        $filter->runWithoutAcl(function () use ($filter, $targetEntity): void {
            $this->assertSame('', $filter->addFilterConstraint($targetEntity, 'test'), 'also disabled forever anyway');
        });

        $this->assertSame('', $filter->addFilterConstraint($targetEntity, 'test'), 'still disabled forever');
    }

    public function testExceptionWillReEnableFilter(): void
    {
        $filter = new AclFilter(_em());
        $targetEntity = _em()->getMetadataFactory()->getMetadataFor(User::class);

        try {
            $filter->runWithoutAcl(function (): void {
                throw new \Exception();
            });
        } catch (\Exception $e) {
        }

        $this->assertNotSame('', $filter->addFilterConstraint($targetEntity, 'test'), 'enabled even after exception');
    }
}
