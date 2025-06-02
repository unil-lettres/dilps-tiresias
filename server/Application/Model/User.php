<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Acl\Acl;
use Application\Api\Enum\UserRoleType;
use Application\Api\Output\GlobalPermissionsListType;
use Application\Api\Scalar\LoginType;
use Application\Enum\UserType;
use Application\Repository\UserRepository;
use Application\Service\Role;
use Application\Traits\HasInstitution;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Cake\Chronos\Chronos;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection as DoctrineCollection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Api\Exception;
use Ecodev\Felix\Model\CurrentUser;
use Ecodev\Felix\Model\Traits\HasName;
use Ecodev\Felix\Utility;
use GraphQL\Doctrine\Attribute as API;

/**
 * User.
 */
#[ORM\UniqueConstraint(name: 'unique_login', columns: ['login', 'site'])]
#[ORM\UniqueConstraint(name: 'unique_email', columns: ['email', 'site'])]
#[ORM\Entity(UserRepository::class)]
class User extends AbstractModel implements \Ecodev\Felix\Model\User, HasSiteInterface
{
    use HasInstitution;
    use HasName;
    use HasSite;

    final public const ROLE_ANONYMOUS = 'anonymous';
    final public const ROLE_STUDENT = 'student';
    final public const ROLE_JUNIOR = 'junior';
    final public const ROLE_SENIOR = 'senior';
    final public const ROLE_MAJOR = 'major';
    final public const ROLE_ADMINISTRATOR = 'administrator';

    private static ?User $currentUser = null;

    /**
     * @var DoctrineCollection<Collection>
     */
    #[ORM\ManyToMany(targetEntity: Collection::class, mappedBy: 'users')]
    private DoctrineCollection $collections;

    /**
     * Set currently logged in user
     * WARNING: this method should only be called from \Application\Authentication\AuthenticationListener.
     */
    public static function setCurrent(?self $user): void
    {
        self::$currentUser = $user;

        // Initialize ACL filter with current user if a logged in one exists
        /** @var UserRepository $userRepository */
        $userRepository = _em()->getRepository(self::class);
        $aclFilter = $userRepository->getAclFilter();
        $aclFilter->setUser($user);

        CurrentUser::set($user);
    }

    /**
     * Returns currently logged user or null.
     */
    public static function getCurrent(): ?self
    {
        return self::$currentUser;
    }

    /**
     * After a `_em()->clear()` this will reload the current user, if any, in order
     * to refresh all data and relations and keep everything else working.
     */
    public static function reloadCurrentUser(): void
    {
        $user = self::$currentUser;
        if ($user) {
            $reloadedUser = _em()->getRepository(self::class)->getOneById($user->getId());
            self::$currentUser = $reloadedUser;
        }
    }

    #[ORM\Column(type: 'string', length: 191)]
    private string $login = '';

    #[API\Exclude]
    #[ORM\Column(type: 'string', length: 255)]
    private string $password = '';

    #[ORM\Column(type: 'string', length: 191, nullable: true)]
    private ?string $email = null;

    #[ORM\Column(type: 'UserRole', options: ['default' => self::ROLE_STUDENT])]
    private string $role = self::ROLE_STUDENT;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?Chronos $activeUntil = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?Chronos $termsAgreement = null;

    #[ORM\Column(type: 'enum', options: ['default' => UserType::Default])]
    private UserType $type = UserType::Default;

    /**
     * @param string $role role for new user
     */
    public function __construct(string $role = self::ROLE_STUDENT)
    {
        $this->collections = new ArrayCollection();
        $this->role = $role;
    }

    /**
     * Set login (eg: johndoe).
     */
    #[API\Input(type: LoginType::class)]
    public function setLogin(string $login): void
    {
        $this->login = $login;
    }

    /**
     * Get login (eg: johndoe).
     */
    #[API\Field(type: LoginType::class)]
    public function getLogin(): string
    {
        return $this->login;
    }

    /**
     * Encrypt and change the user password.
     */
    public function setPassword(string $password): void
    {
        // Ignore empty password that could be sent "by mistake" by the client
        // when agreeing to terms
        if ($password === '') {
            return;
        }

        $this->password = password_hash($password, PASSWORD_DEFAULT);
    }

    /**
     * Returns the hashed password.
     */
    #[API\Exclude]
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * Set email.
     */
    #[API\Input(type: '?Email')]
    public function setEmail(?string $email): void
    {
        $this->email = $email;
    }

    /**
     * Get email.
     */
    #[API\Field(type: '?Email')]
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * Get the user role.
     */
    #[API\Field(type: UserRoleType::class)]
    public function getRole(): string
    {
        return $this->role;
    }

    /**
     * Sets the user role.
     */
    #[API\Input(type: UserRoleType::class)]
    public function setRole(string $role): void
    {
        if (!Role::canUpdate(self::getCurrent(), $this->role, $role)) {
            $currentRole = self::getCurrent() ? self::getCurrent()->getRole() : self::ROLE_ANONYMOUS;

            throw new Exception($currentRole . ' is not allowed to change role from ' . $this->role . ' to ' . $role);
        }

        $this->role = $role;
    }

    /**
     * The date until the user is active. Or `null` if there is not limit in time.
     */
    public function getActiveUntil(): ?Chronos
    {
        return $this->activeUntil;
    }

    /**
     * The date until the user is active. Or `null` if there is not limit in time.
     */
    public function setActiveUntil(?Chronos $activeUntil): void
    {
        $this->activeUntil = $activeUntil;
    }

    /**
     * The date when the user agreed to the terms of usage.
     */
    public function getTermsAgreement(): ?Chronos
    {
        return $this->termsAgreement;
    }

    /**
     * The date when the user agreed to the terms of usage.
     *
     * A user cannot un-agree once he agreed.
     */
    public function setTermsAgreement(?Chronos $termsAgreement): void
    {
        $this->termsAgreement = $termsAgreement;
    }

    /**
     * Set user type.
     */
    public function setType(UserType $type): void
    {
        $this->type = $type;
    }

    /**
     * Get user type.
     */
    public function getType(): UserType
    {
        return $this->type;
    }

    /**
     * Get a list of global permissions for this user.
     */
    #[API\Field(type: GlobalPermissionsListType::class)]
    public function getGlobalPermissions(): array
    {
        $acl = new Acl();
        $types = [
            Artist::class,
            Card::class,
            Change::class,
            Collection::class,
            Country::class,
            Dating::class,
            Institution::class,
            Tag::class,
            Domain::class,
            DocumentType::class,
            News::class,
            Period::class,
            Material::class,
            AntiqueName::class,
            self::class,
        ];

        $permissions = ['create'];
        $result = [];

        $previousUser = self::getCurrent();
        self::setCurrent($this);
        foreach ($types as $type) {
            $instance = new $type();

            // Simulate current site on new object
            if ($instance instanceof HasSiteInterface) {
                $site = $this->getSite();
                $instance->setSite($site);
            }

            $sh = lcfirst(Utility::getShortClassName($instance));
            $result[$sh] = [];

            foreach ($permissions as $p) {
                $result[$sh][$p] = $acl->isCurrentUserAllowed($instance, $p);
            }
        }

        self::setCurrent($previousUser);

        return $result;
    }

    /**
     * Notify the Card that it was added to a Collection.
     * This should only be called by Collection::addCard().
     */
    public function collectionAdded(Collection $collection): void
    {
        $this->collections->add($collection);
    }

    /**
     * Notify the Card that it was removed from a Collection.
     * This should only be called by Collection::removeCard().
     */
    public function collectionRemoved(Collection $collection): void
    {
        $this->collections->removeElement($collection);
    }

    /**
     * Whether the user is allowed to log in or stay logged in.
     */
    public function canLogin(): bool
    {
        return !$this->getActiveUntil() || $this->getActiveUntil() > new Chronos();
    }
}
