<?php

declare(strict_types=1);

namespace ApplicationTest\ORM\Query\Filter;

use Application\Enum\Site;
use Application\Model\Artist;
use Application\Model\Card;
use Application\Model\Change;
use Application\Model\Collection;
use Application\Model\Country;
use Application\Model\Dating;
use Application\Model\Institution;
use Application\Model\Tag;
use Application\Model\User;
use Application\Repository\UserRepository;
use Doctrine\ORM\Mapping\ClassMetadata;
use Ecodev\Felix\ORM\Query\Filter\AclFilter;
use PHPUnit\Framework\TestCase;

class AclFilterTest extends TestCase
{
    public function providerFilter(): iterable
    {
        yield 'country is totally public public class, access everything' => [
            null,
            Country::class,
            '',
        ];
        yield 'artist is totally public public class, access everything' => [
            null,
            Artist::class,
            '',
        ];
        yield 'institution is totally public public class, access everything' => [
            null,
            Institution::class,
            '',
        ];
        yield 'tag is totally public public class, access everything' => [
            null,
            Tag::class,
            '',
        ];
        yield 'dating is totally public public class, access everything' => [
            null,
            Dating::class,
            '',
        ];
        yield 'users are invisible to anonymous' => [
            null,
            User::class,
            'test.id IN (-1)',
        ];
        yield 'users are accessible to any other users' => [
            'student',
            User::class,
            '',
        ];
        yield 'only public cards are accessible to anonymous' => [
            null,
            Card::class,
            'test.id IN (SELECT card.id FROM card WHERE card.visibility IN (\'public\'))',
        ];
        yield 'student can access cards that are his own or are public or member' => [
            'student',
            Card::class,
            'test.id IN (SELECT card.id FROM card LEFT JOIN card_collection card_collection ON card_collection.card_id = card.id LEFT JOIN collection_user collection_user ON card_collection.collection_id = collection_user.collection_id WHERE (card.visibility IN (\'public\', \'member\')) OR (card.owner_id = 1003) OR (card.creator_id = 1003) OR (collection_user.user_id = 1003))',
        ];
        yield 'collections are invisible to anonymous' => [
            null,
            Collection::class,
            'test.id IN (-1)',
        ];
        yield 'student can access collections that are his own or are member' => [
            'student',
            Collection::class,
            'test.id IN (WITH RECURSIVE parent AS',
        ];
        yield 'administrator can access collections that are his own or are administrator or member' => [
            'administrator',
            Collection::class,
            'test.id IN (WITH RECURSIVE parent AS',
        ];
        yield 'changes are invisible to anonymous' => [
            null,
            Change::class,
            'test.id IN (-1)',
        ];
        yield 'student can access changes that are his own' => [
            'student',
            Change::class,
            'test.id IN (SELECT `change`.id FROM `change` WHERE `change`.owner_id = 1003 OR `change`.creator_id = 1003)',
        ];
    }

    /**
     * @dataProvider providerFilter
     */
    public function testFilter(?string $login, string $class, string $expected): void
    {
        /** @var UserRepository $userRepository */
        $userRepository = _em()->getRepository(User::class);
        $user = $userRepository->getOneByLogin($login, Site::Dilps);
        $filter = new AclFilter(_em());
        $filter->setUser($user);
        /** @var ClassMetadata $targetEntity */
        $targetEntity = _em()->getMetadataFactory()->getMetadataFor($class);
        $actual = $filter->addFilterConstraint($targetEntity, 'test');

        if ($expected === '') {
            self::assertSame($expected, $actual);
        } else {
            self::assertStringStartsWith($expected, $actual);
        }
    }
}
