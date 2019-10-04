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
     *
     * @return null|User
     */
    public function getLoginPassword(string $login, string $password): ?User
    {
        /** @var User $user */
        $user = $this->getOneByLogin($login);

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
     *
     * @return null|User
     */
    public function getOneByLogin(?string $login): ?User
    {
        $user = $this->getAclFilter()->runWithoutAcl(function () use ($login) {
            return $this->findOneByLogin($login);
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
     *
     * @return null|User
     */
    public function getOneByEmail(?string $email): ?User
    {
        $user = $this->getAclFilter()->runWithoutAcl(function () use ($email) {
            return $this->findOneByEmail($email);
        });

        return $user;
    }

    /**
     * Create new Shibboleth user.
     *
     * @param string $login
     * @param string $mail
     *
     * @return User
     */
    public function createShibboleth(string $login, string $mail): User
    {
        $user = new User();
        $user->setLogin($login);
        $user->setEmail($mail);
        $user->setType(User::TYPE_UNIL);
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
