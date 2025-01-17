<?php

declare(strict_types=1);

namespace Application\Acl;

use Application\Acl\Assertion\CanUpdateCard;
use Application\Acl\Assertion\IsCreator;
use Application\Acl\Assertion\IsNotSuggestion;
use Application\Acl\Assertion\IsOwnerOrResponsible;
use Application\Acl\Assertion\IsSuggestion;
use Application\Acl\Assertion\SameSite;
use Application\Acl\Assertion\Visibility;
use Application\Enum\CollectionVisibility;
use Application\Model\AntiqueName;
use Application\Model\Artist;
use Application\Model\Card;
use Application\Model\Change;
use Application\Model\Collection;
use Application\Model\Country;
use Application\Model\Dating;
use Application\Model\DocumentType;
use Application\Model\Domain;
use Application\Model\Export;
use Application\Model\File;
use Application\Model\Institution;
use Application\Model\Material;
use Application\Model\News;
use Application\Model\Period;
use Application\Model\Statistic;
use Application\Model\Tag;
use Application\Model\User;
use Ecodev\Felix\Acl\Assertion\All;
use Ecodev\Felix\Acl\Assertion\IsMyself;
use Ecodev\Felix\Acl\Assertion\One;

class Acl extends \Ecodev\Felix\Acl\Acl
{
    public function __construct()
    {
        parent::__construct();

        $this->addRole(User::ROLE_ANONYMOUS);
        $this->addRole(User::ROLE_STUDENT, User::ROLE_ANONYMOUS);
        $this->addRole(User::ROLE_JUNIOR, User::ROLE_STUDENT);
        $this->addRole(User::ROLE_SENIOR, User::ROLE_JUNIOR);
        $this->addRole(User::ROLE_MAJOR, User::ROLE_SENIOR);
        $this->addRole(User::ROLE_ADMINISTRATOR, User::ROLE_ANONYMOUS);

        $artist = $this->createModelResource(Artist::class);
        $card = $this->createModelResource(Card::class);
        $change = $this->createModelResource(Change::class);
        $collection = $this->createModelResource(Collection::class);
        $country = $this->createModelResource(Country::class);
        $dating = $this->createModelResource(Dating::class);
        $institution = $this->createModelResource(Institution::class);
        $tag = $this->createModelResource(Tag::class);
        $user = $this->createModelResource(User::class);
        $file = $this->createModelResource(File::class);
        $export = $this->createModelResource(Export::class);

        $documentType = $this->createModelResource(DocumentType::class);
        $domain = $this->createModelResource(Domain::class);
        $material = $this->createModelResource(Material::class);
        $antiqueName = $this->createModelResource(AntiqueName::class);
        $news = $this->createModelResource(News::class);
        $period = $this->createModelResource(Period::class);
        $statistic = $this->createModelResource(Statistic::class);

        $this->allow(User::ROLE_ANONYMOUS, $artist, 'read');
        $this->allow(User::ROLE_ANONYMOUS, $card, 'read');
        $this->allow(User::ROLE_ANONYMOUS, $country, 'read');
        $this->allow(User::ROLE_ANONYMOUS, $dating, 'read');
        $this->allow(User::ROLE_ANONYMOUS, $institution, 'read');
        $this->allow(User::ROLE_ANONYMOUS, $tag, 'read');
        $this->allow(User::ROLE_ANONYMOUS, $documentType, 'read');
        $this->allow(User::ROLE_ANONYMOUS, $domain, 'read');
        $this->allow(User::ROLE_ANONYMOUS, $material, 'read');
        $this->allow(User::ROLE_ANONYMOUS, $antiqueName, 'read');
        $this->allow(User::ROLE_ANONYMOUS, $news, 'read');
        $this->allow(User::ROLE_ANONYMOUS, $period, 'read');
        $this->allow(User::ROLE_ANONYMOUS, $file, 'read');
        $this->allow(User::ROLE_ANONYMOUS, $export, ['read', 'create']);

        $this->allow(User::ROLE_STUDENT, $artist, 'create', new SameSite());
        $this->allow(User::ROLE_STUDENT, $card, 'create', new SameSite());
        $this->allow(User::ROLE_STUDENT, $card, ['update'], new All(new IsSuggestion(), new IsOwnerOrResponsible(), new SameSite()));
        $this->allow(User::ROLE_STUDENT, $file, ['create', 'update', 'delete'], new CanUpdateCard());
        $this->allow(User::ROLE_STUDENT, $collection, 'read');
        $this->allow(User::ROLE_STUDENT, $change, 'read', new IsOwnerOrResponsible());
        $this->allow(User::ROLE_STUDENT, $change, 'create', new SameSite());
        $this->allow(User::ROLE_STUDENT, $collection, 'create', new SameSite());
        $this->allow(User::ROLE_STUDENT, $collection, ['update', 'delete', 'linkCard'], new All(new IsOwnerOrResponsible(), new SameSite()));
        $this->allow(User::ROLE_STUDENT, $institution, 'create', new SameSite());
        $this->allow(User::ROLE_STUDENT, $tag, 'create', new SameSite());
        $this->allow(User::ROLE_STUDENT, $user, 'read');
        $this->allow(User::ROLE_STUDENT, $user, ['update', 'delete'], new All(new IsMyself(), new SameSite()));

        $this->allow(User::ROLE_JUNIOR, $card, ['update'], new All(new IsOwnerOrResponsible(), new SameSite()));
        $this->allow(User::ROLE_JUNIOR, $card, ['delete'], new All(new IsNotSuggestion(), new IsOwnerOrResponsible(), new SameSite()));

        $this->allow(User::ROLE_SENIOR, $card, ['delete'], new All(new IsOwnerOrResponsible(), new SameSite()));

        $this->allow(User::ROLE_MAJOR, $collection, 'delete', new All(new IsOwnerOrResponsible(), new SameSite()));
        $this->allow(User::ROLE_MAJOR, $collection, ['linkCard'], new SameSite());

        // Administrator inherits only read from anonymous, and is allowed **almost** all other privileges
        $this->allow(User::ROLE_ADMINISTRATOR, $artist, null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, $card, 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, $card, null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, $change, null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, $collection, 'create', new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, $collection, null, new All(new One(new IsOwnerOrResponsible(), new IsCreator(), new Visibility([CollectionVisibility::Member, CollectionVisibility::Administrator])), new SameSite()));
        $this->allow(User::ROLE_ADMINISTRATOR, $institution, 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, $institution, null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, $tag, 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, $tag, null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, $user, 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, $user, null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, $news, null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, $documentType, 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, $documentType, null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, $domain, 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, $domain, null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, $material, 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, $material, null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, $antiqueName, 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, $antiqueName, null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, $news, 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, $news, null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, $period, 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, $period, null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, $statistic, 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, $file, 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, $file, ['create', 'update', 'delete'], new CanUpdateCard());
    }
}
