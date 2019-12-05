<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\User;
use DateTimeImmutable;
use Doctrine\ORM\QueryBuilder;

class UserRepository extends AbstractRepository implements LimitedAccessSubQueryInterface
{
    public function getFindAllQuery(array $filters = [], array $sorting = []): QueryBuilder
    {
        $qb = $this->createQueryBuilder('user');

        if (@$filters['login']) {
            $qb->andWhere('user.login LIKE :login');
            $qb->setParameter('login', '%' . $filters['login'] . '%');
        }

        if (@$filters['email']) {
            $qb->andWhere('user.email LIKE :email');
            $qb->setParameter('email', '%' . $filters['email'] . '%');
        }

        $this->applySearch($qb, $filters, 'user');
        $this->applySorting($qb, $sorting, 'user');

        return $qb;
    }

    /**
     * Returns the user authenticated by its login and password
     *
     * @param string $login
     * @param string $password
     * @param string $site
     *
     * @return null|User
     */
    public function getLoginPassword(string $login, string $password, string $site): ?User
    {
        /** @var User $user */
        $user = $this->getOneByLogin($login, $site);

        if (!$user || ($user->getActiveUntil() && $user->getActiveUntil() < new DateTimeImmutable())) {
            return null;
        }

        $hashFromDb = $user->getPassword();
        $isMd5 = mb_strlen($hashFromDb) === 32 && ctype_xdigit($hashFromDb);

        // If we found a user and he has a correct MD5 or correct new hash, then return the user
        if (($isMd5 && md5($password) === $hashFromDb) || password_verify($password, $hashFromDb)) {

            // Update the hash in DB, if we are still MD5, or if PHP default options changed
            if ($isMd5 || password_needs_rehash($hashFromDb, PASSWORD_DEFAULT)) {
                $user->setPassword($password);
                _em()->flush();
            }

            return $user;
        }

        return null;
    }

    /**
     * Unsecured way to get a user from its login.
     *
     * This should only be used in tests or controlled environment.
     *
     * @param null|string $login
     * @param string $site
     *
     * @return null|User
     */
    public function getOneByLogin(?string $login, string $site): ?User
    {
        $user = $this->getAclFilter()->runWithoutAcl(function () use ($login, $site) {
            return $this->findOneBy([
                'login' => $login,
                'site' => $site,
            ]);
        });

        return $user;
    }

    /**
     * Unsecured way to get a user from its ID.
     *
     * This should only be used in tests or controlled environment.
     *
     * @param int $id
     *
     * @return null|User
     */
    public function getOneById(int $id): ?User
    {
        $user = $this->getAclFilter()->runWithoutAcl(function () use ($id) {
            return $this->findOneById($id);
        });

        return $user;
    }

    /**
     * Unsecured way to get a user from its email.
     *
     * This should only be used in tests or controlled environment.
     *
     * @param null|string $email
     * @param string $site
     *
     * @return null|User
     */
    public function getOneByEmail(?string $email, string $site): ?User
    {
        $user = $this->getAclFilter()->runWithoutAcl(function () use ($email, $site) {
            return $this->findOneBy([
                'email' => $email,
                'site' => $site,
            ]);
        });

        return $user;
    }

    /**
     * Create new Shibboleth user.
     *
     * @param string $login
     * @param string $email
     * @param string $site
     *
     * @return User
     */
    public function createShibboleth(string $login, string $email, string $site): User
    {
        $user = new User();
        $user->setLogin($login);
        $user->setEmail($email);
        $user->setType(User::TYPE_AAI);
        $user->setRole(User::ROLE_STUDENT);

        _em()->persist($user);
        _em()->flush();

        return $user;
    }

    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     *
     * @param null|User $user
     *
     * @return string
     */
    public function getAccessibleSubQuery(?User $user): string
    {
        if ($user) {
            return $this->getAllIdsQuery();
        }

        return '-1';
    }
}
