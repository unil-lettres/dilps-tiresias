<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Enum\CardVisibility;
use Application\Enum\Site;
use Application\Model\Card;
use Application\Model\Change;
use Application\Model\Collection;
use Application\Model\Country;
use Application\Model\Tag;
use Application\Model\User;
use Cake\Chronos\Chronos;
use PHPUnit\Framework\TestCase;

class CardTest extends TestCase
{
    protected function tearDown(): void
    {
        User::setCurrent(null);
        Chronos::setTestNow(null);
    }

    public function testName(): void
    {
        $withoutName = new Card();
        self::assertSame('', $withoutName->getName());

        $withName = new Card('test name');
        self::assertSame('test name', $withName->getName());
    }

    public function testGetPath(): void
    {
        $card = new Card();
        $card->setFilename('photo.jpg');

        self::assertSame('photo.jpg', $card->getFilename());
        $appPath = realpath('.');
        $expected = $appPath . '/data/images/photo.jpg';
        self::assertSame($expected, $card->getPath());
    }

    public function testSetDating(): void
    {
        $card = new Card();

        self::assertCount(0, $card->getDatings());

        $card->setDating('2000');
        self::assertCount(1, $card->getDatings());
        $original = $card->getDatings()->first();

        $card->setDating('2000');
        self::assertCount(1, $card->getDatings());
        self::assertSame($original, $card->getDatings()->first(), 'must be same dating');

        $card->setDating('1980-1990');
        self::assertCount(1, $card->getDatings());
        self::assertNotSame($original, $card->getDatings()->first(), 'must be new one');

        $card->setDating('');
        self::assertCount(0, $card->getDatings());
    }

    public function testCopyInto(): void
    {
        $admin = new User(User::ROLE_ADMINISTRATOR);
        User::setCurrent($admin);

        $suggestion = new Card();
        $suggestion->setSite(Site::Dilps);
        $suggestion->setVisibility(CardVisibility::Member);
        $suggestion->setCode('code-suggestion');
        $suggestion->setName('test name');
        $suggestion->setDating('2010');
        $suggestion->setArtists(['John', 'Sarah']);
        $suggestion->setInstitution('Museum');
        $suggestion->setCountry(new Country());
        $suggestion->timestampCreation();
        $suggestion->setWidth(123);
        $suggestion->setHeight(123);
        $suggestion->setFileSize(123);
        $suggestion->setFilename('foo.png');
        touch($suggestion->getPath());

        $collection = new Collection();
        $suggestion->addCollection($collection);

        $original = new Card();
        $original->setVisibility(CardVisibility::Public);
        $original->setCode('code-original');
        $original->setWidth(456);
        $original->setHeight(456);
        $original->setFileSize(456);
        $suggestion->setOriginal($original);
        $suggestion->copyInto($original);

        self::assertSame(CardVisibility::Public, $original->getVisibility());
        self::assertSame('code-original', $original->getCode());
        self::assertSame('test name', $original->getName());
        self::assertSame('2010', $original->getDating());
        self::assertSame('2010-01-01T00:00:00+00:00', $original->getDatings()->first()->getFrom()->format('c'), 'datings should be re-computed');
        self::assertCount(2, $original->getArtists(), 'artists should be copied');
        self::assertSame('Museum', $original->getInstitution()->getName(), 'institution should be copied');
        self::assertNotNull($original->getCountry(), 'country should be copied');
        self::assertNull($original->getOriginal(), 'original should not be copied over');
        self::assertCount(0, $original->getCollections(), 'original should not be moved to intro a collection');

        self::assertNotEquals('', $original->getFilename(), 'should have file on disk');
        self::assertNotEquals($suggestion->getFilename(), $original->getFilename(), 'should not share the same file on disk');
        self::assertFileExists($original->getPath(), 'file on disk should have been copied');

        self::assertSame(123, $original->getWidth());
        self::assertSame(123, $original->getHeight());
        self::assertSame(123, $original->getFileSize());
    }

    public function testCopyIntoWithoutFile(): void
    {
        $original = new Card();
        $original->setWidth(456);
        $original->setHeight(456);
        $original->setFileSize(456);

        $suggestion = new Card();
        $suggestion->copyInto($original);

        self::assertSame(456, $original->getWidth());
        self::assertSame(456, $original->getHeight());
        self::assertSame(456, $original->getFileSize());
    }

    public function testRelatedCards(): void
    {
        $card1 = new Card();
        $card2 = new Card();

        self::assertCount(0, $card1->getCards());
        self::assertCount(0, $card2->getCards());

        $card1->addCard($card2);

        self::assertCount(1, $card1->getCards());
        self::assertCount(1, $card2->getCards());

        self::assertSame($card2, $card1->getCards()->first());
        self::assertSame($card1, $card2->getCards()->first());

        $card2->removeCard($card1);

        self::assertCount(0, $card1->getCards());
        self::assertCount(0, $card2->getCards());
    }

    public function testRelatedCardWithSelf(): void
    {
        $this->expectExceptionMessage('A card cannot be related to itself');
        $card = new Card();
        $card->addCard($card);
    }

    public function testGetPermissions(): void
    {
        $card = new Card();
        $card->setSite(Site::Dilps);
        $actual = $card->getPermissions();
        $expected = [
            'create' => false,
            'read' => true,
            'update' => false,
            'delete' => false,
        ];
        self::assertEquals($expected, $actual, 'should be able to get permissions as anonymous');

        // Make it the current user as creator
        $user = new User();
        $user->setSite(Site::Dilps);
        User::setCurrent($user);
        $card->timestampCreation();

        $actual2 = $card->getPermissions();
        $expected2 = [
            'create' => true,
            'read' => true,
            'update' => false,
            'delete' => false,
        ];
        self::assertEquals($expected2, $actual2, 'should be able to get permissions as creator');
    }

    public function testChange(): void
    {
        $card = new Card();
        $change = new Change();
        self::assertNull($card->getChange());

        $change->setSuggestion($card);
        self::assertSame($change, $card->getChange());

        $change->setSuggestion(null);
        self::assertNull($card->getChange());
    }

    /**
     * @dataProvider providerSetVisibility
     */
    public function testSetVisibility(string $role, CardVisibility $previous, CardVisibility $next, bool $shouldThrow): void
    {
        $admin = new User(User::ROLE_ADMINISTRATOR);
        User::setCurrent($admin);
        $card = new Card();
        $card->setVisibility($previous);

        $user = new User($role);
        User::setCurrent($user);

        if ($shouldThrow) {
            $this->expectExceptionMessage('Only administrator can make a card public');
        }

        $card->setVisibility($next);
        self::assertSame($next, $card->getVisibility());
    }

    public function providerSetVisibility(): iterable
    {
        yield [User::ROLE_STUDENT, CardVisibility::Private, CardVisibility::Private, false];
        yield [User::ROLE_STUDENT, CardVisibility::Private, CardVisibility::Member, false];
        yield [User::ROLE_STUDENT, CardVisibility::Private, CardVisibility::Public, true];
        yield [User::ROLE_STUDENT, CardVisibility::Member, CardVisibility::Private, false];
        yield [User::ROLE_STUDENT, CardVisibility::Member, CardVisibility::Member, false];
        yield [User::ROLE_STUDENT, CardVisibility::Member, CardVisibility::Public, true];
        yield [User::ROLE_STUDENT, CardVisibility::Public, CardVisibility::Private, false];
        yield [User::ROLE_STUDENT, CardVisibility::Public, CardVisibility::Member, false];
        yield [User::ROLE_STUDENT, CardVisibility::Public, CardVisibility::Public, false];
        yield [User::ROLE_ADMINISTRATOR, CardVisibility::Private, CardVisibility::Private, false];
        yield [User::ROLE_ADMINISTRATOR, CardVisibility::Private, CardVisibility::Member, false];
        yield [User::ROLE_ADMINISTRATOR, CardVisibility::Private, CardVisibility::Public, false];
        yield [User::ROLE_ADMINISTRATOR, CardVisibility::Member, CardVisibility::Private, false];
        yield [User::ROLE_ADMINISTRATOR, CardVisibility::Member, CardVisibility::Member, false];
        yield [User::ROLE_ADMINISTRATOR, CardVisibility::Member, CardVisibility::Public, false];
        yield [User::ROLE_ADMINISTRATOR, CardVisibility::Public, CardVisibility::Private, false];
        yield [User::ROLE_ADMINISTRATOR, CardVisibility::Public, CardVisibility::Member, false];
        yield [User::ROLE_ADMINISTRATOR, CardVisibility::Public, CardVisibility::Public, false];
    }

    public function testSetInstitution(): void
    {
        $card = new Card();
        $card->setSite(Site::Dilps);
        self::assertNull($card->getInstitution());

        $card->setInstitution('foo');
        $institution1 = $card->getInstitution();
        self::assertSame('foo', $institution1->getName(), 'can set new institution');

        $card->setInstitution('foo');
        $institution2 = $card->getInstitution();
        self::assertSame($institution1, $institution2, 'change for same same will have no effect at all');
        self::assertSame('foo', $institution2->getName(), 'did not change');

        $card->setInstitution('bar');
        $institution3 = $card->getInstitution();
        self::assertNotSame($institution1, $institution3, 'can change for something else');
        self::assertSame('bar', $institution3->getName(), 'new name');
    }

    public function testSetTags(): void
    {
        $card = new Card();
        $card->setSite(Site::Dilps);

        self::assertEquals([], $this->toIds($card->getTags()));

        $card->setTags([
            '4000',
        ]);
        self::assertEquals([], $this->toIds($card->getTags()), 'still empty because not leaf');

        $card->setTags([
            '4001',
        ]);
        self::assertEquals([4001, 4000], $this->toIds($card->getTags()), 'leaf added and parent automatically added');

        $card->getTags()->clear();
        self::assertEquals([], $this->toIds($card->getTags()));

        $card->setTags([
            '4000',
            '4001',
        ]);
        self::assertEquals([4001, 4000], $this->toIds($card->getTags()), 'also adding parent change nothing to result');

        $card->getTags()->clear();
        self::assertEquals([], $this->toIds($card->getTags()));

        $card->setTags([
            '4001',
            '4004',
        ]);
        self::assertEquals([4001, 4000], $this->toIds($card->getTags()), 'adding another parent change nothing to result');

        $card->setTags([
            '4001',
            '4005',
        ]);
        self::assertEquals([4001, 4000, 4005, 4004], $this->toIds($card->getTags()), 'adding two leaves select everything');

        $card->removeTag(_em()->getReference(Tag::class, 4000));
        self::assertEquals([4001, 4000, 4005, 4004], $this->toIds($card->getTags()), 'removing parent has no effect');

        $card->removeTag(_em()->getReference(Tag::class, 4001));
        self::assertEquals([4005, 4004], $this->toIds($card->getTags()), 'removing child remove hierarchy');

        $card->addTag(_em()->getReference(Tag::class, 4001));
        self::assertEquals([4005, 4004, 4001, 4000], $this->toIds($card->getTags()), 'adding again child re-add hierarchy');
    }

    private function toIds(iterable $models): array
    {
        $ids = [];
        foreach ($models as $model) {
            $ids[] = $model->getId();
        }

        return $ids;
    }

    public function testCollectionRelation(): void
    {
        $card = new Card();
        self::assertCount(0, $card->getCollections(), 'should have no collections');

        $collection = new Collection();

        $card->addCollection($collection);
        self::assertCount(1, $card->getCollections(), 'should have the added collection');
        self::assertSame($collection, $card->getCollections()->first(), 'should be able to retrieve added collection');

        $card->addCollection($collection);
        self::assertCount(1, $card->getCollections(), 'should still have the same unique collection');

        $collection2 = new Collection();
        $card->addCollection($collection2);
        self::assertCount(2, $card->getCollections(), 'should be able to add second collection');

        $card->removeCollection($collection);
        self::assertCount(1, $card->getCollections(), 'should be able to remove first collection');
        self::assertSame($collection2, $card->getCollections()->first(), 'should be have only second collection left');
    }
}
