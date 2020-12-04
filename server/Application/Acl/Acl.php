<?php

declare(strict_types=1);

namespace Application\Acl;

use Application\Acl\Assertion\All;
use Application\Acl\Assertion\IsCreator;
use Application\Acl\Assertion\IsMyself;
use Application\Acl\Assertion\IsNotSuggestion;
use Application\Acl\Assertion\IsOwnerOrResponsible;
use Application\Acl\Assertion\IsSuggestion;
use Application\Acl\Assertion\One;
use Application\Acl\Assertion\SameSite;
use Application\Acl\Assertion\Visibility;
use Application\Model\AbstractModel;
use Application\Model\AntiqueName;
use Application\Model\Artist;
use Application\Model\Card;
use Application\Model\Change;
use Application\Model\Collection;
use Application\Model\Country;
use Application\Model\Dating;
use Application\Model\DocumentType;
use Application\Model\Domain;
use Application\Model\Institution;
use Application\Model\Material;
use Application\Model\News;
use Application\Model\Period;
use Application\Model\Statistic;
use Application\Model\Tag;
use Application\Model\User;
use Doctrine\Common\Util\ClassUtils;

class Acl extends \Laminas\Permissions\Acl\Acl
{
    /**
     * The message explaining the last denial
     *
     * @var null|string
     */
    private $message;

    public function __construct()
    {
        $this->addRole(User::ROLE_ANONYMOUS);
        $this->addRole(User::ROLE_STUDENT, User::ROLE_ANONYMOUS);
        $this->addRole(User::ROLE_JUNIOR, User::ROLE_STUDENT);
        $this->addRole(User::ROLE_SENIOR, User::ROLE_JUNIOR);
        $this->addRole(User::ROLE_MAJOR, User::ROLE_SENIOR);
        $this->addRole(User::ROLE_ADMINISTRATOR, User::ROLE_ANONYMOUS);

        $this->addResource(new ModelResource(Artist::class));
        $this->addResource(new ModelResource(Card::class));
        $this->addResource(new ModelResource(Change::class));
        $this->addResource(new ModelResource(Collection::class));
        $this->addResource(new ModelResource(Country::class));
        $this->addResource(new ModelResource(Dating::class));
        $this->addResource(new ModelResource(Institution::class));
        $this->addResource(new ModelResource(Tag::class));
        $this->addResource(new ModelResource(User::class));

        $this->addResource(new ModelResource(DocumentType::class));
        $this->addResource(new ModelResource(Domain::class));
        $this->addResource(new ModelResource(Material::class));
        $this->addResource(new ModelResource(AntiqueName::class));
        $this->addResource(new ModelResource(News::class));
        $this->addResource(new ModelResource(Period::class));
        $this->addResource(new ModelResource(Statistic::class));

        $this->allow(User::ROLE_ANONYMOUS, new ModelResource(Artist::class), 'read');
        $this->allow(User::ROLE_ANONYMOUS, new ModelResource(Card::class), 'read');
        $this->allow(User::ROLE_ANONYMOUS, new ModelResource(Country::class), 'read');
        $this->allow(User::ROLE_ANONYMOUS, new ModelResource(Dating::class), 'read');
        $this->allow(User::ROLE_ANONYMOUS, new ModelResource(Institution::class), 'read');
        $this->allow(User::ROLE_ANONYMOUS, new ModelResource(Tag::class), 'read');
        $this->allow(User::ROLE_ANONYMOUS, new ModelResource(DocumentType::class), 'read');
        $this->allow(User::ROLE_ANONYMOUS, new ModelResource(Domain::class), 'read');
        $this->allow(User::ROLE_ANONYMOUS, new ModelResource(Material::class), 'read');
        $this->allow(User::ROLE_ANONYMOUS, new ModelResource(AntiqueName::class), 'read');
        $this->allow(User::ROLE_ANONYMOUS, new ModelResource(News::class), 'read');
        $this->allow(User::ROLE_ANONYMOUS, new ModelResource(Period::class), 'read');

        $this->allow(User::ROLE_STUDENT, new ModelResource(Artist::class), 'create', new SameSite());
        $this->allow(User::ROLE_STUDENT, new ModelResource(Card::class), 'create', new SameSite());
        $this->allow(User::ROLE_STUDENT, new ModelResource(Card::class), ['update'], new All(new IsSuggestion(), new IsOwnerOrResponsible(), new SameSite()));
        $this->allow(User::ROLE_STUDENT, new ModelResource(Collection::class), 'read');
        $this->allow(User::ROLE_STUDENT, new ModelResource(Change::class), 'read', new IsOwnerOrResponsible());
        $this->allow(User::ROLE_STUDENT, new ModelResource(Change::class), 'create', new SameSite());
        $this->allow(User::ROLE_STUDENT, new ModelResource(Collection::class), 'create', new SameSite());
        $this->allow(User::ROLE_STUDENT, new ModelResource(Collection::class), ['update', 'delete', 'linkCard'], new All(new IsOwnerOrResponsible(), new SameSite()));
        $this->allow(User::ROLE_STUDENT, new ModelResource(Institution::class), 'create', new SameSite());
        $this->allow(User::ROLE_STUDENT, new ModelResource(Tag::class), 'create', new SameSite());
        $this->allow(User::ROLE_STUDENT, new ModelResource(User::class), 'read');
        $this->allow(User::ROLE_STUDENT, new ModelResource(User::class), ['update', 'delete'], new All(new IsMyself(), new SameSite()));

        $this->allow(User::ROLE_JUNIOR, new ModelResource(Card::class), ['update'], new All(new IsOwnerOrResponsible(), new SameSite()));
        $this->allow(User::ROLE_JUNIOR, new ModelResource(Card::class), ['delete'], new All(new IsNotSuggestion(), new IsOwnerOrResponsible(), new SameSite()));

        $this->allow(User::ROLE_SENIOR, new ModelResource(Card::class), ['delete'], new All(new IsOwnerOrResponsible(), new SameSite()));

        $this->allow(User::ROLE_MAJOR, new ModelResource(Collection::class), 'delete', new All(new IsOwnerOrResponsible(), new SameSite()));
        $this->allow(User::ROLE_MAJOR, new ModelResource(Collection::class), ['linkCard'], new SameSite());

        // Administrator inherits only read from anonymous, and is allowed **almost** all other privileges
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Artist::class), null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Card::class), 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Card::class), null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Change::class), null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Collection::class), 'create', new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Collection::class), null, new All(new One(new IsOwnerOrResponsible(), new IsCreator(), new Visibility([Collection::VISIBILITY_MEMBER, Collection::VISIBILITY_ADMINISTRATOR])), new SameSite()));
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Institution::class), 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Institution::class), null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Tag::class), 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Tag::class), null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(User::class), 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(User::class), null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(News::class), null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(DocumentType::class), 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(DocumentType::class), null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Domain::class), 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Domain::class), null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Material::class), 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Material::class), null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(AntiqueName::class), 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(AntiqueName::class), null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(News::class), 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(News::class), null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Period::class), 'read');
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Period::class), null, new SameSite());
        $this->allow(User::ROLE_ADMINISTRATOR, new ModelResource(Statistic::class), 'read');
    }

    /**
     * Return whether the current user is allowed to do something
     *
     * This should be the main method to do all ACL checks.
     */
    public function isCurrentUserAllowed(AbstractModel $model, string $privilege): bool
    {
        $resource = new ModelResource($this->getClass($model), $model);

        $role = $this->getCurrentRole();

        $isAllowed = $this->isAllowed($role, $resource, $privilege);

        $this->message = $this->buildMessage($resource, $privilege, $role, $isAllowed);

        return $isAllowed;
    }

    private function getClass(AbstractModel $resource): string
    {
        return ClassUtils::getRealClass(get_class($resource));
    }

    private function getCurrentRole(): string
    {
        $user = User::getCurrent();
        if (!$user) {
            return 'anonymous';
        }

        return $user->getRole();
    }

    private function buildMessage($resource, ?string $privilege, string $role, bool $isAllowed): ?string
    {
        if ($isAllowed) {
            return null;
        }

        if ($resource instanceof ModelResource) {
            $resource = $resource->getName();
        }

        $user = User::getCurrent() ? 'User "' . User::getCurrent()->getLogin() . '"' : 'Non-logged user';
        $privilege = $privilege === null ? 'NULL' : $privilege;

        return "$user with role $role is not allowed on resource \"$resource\" with privilege \"$privilege\"";
    }

    /**
     * Returns the message explaining the last denial, if any
     */
    public function getLastDenialMessage(): ?string
    {
        return $this->message;
    }
}
