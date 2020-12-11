<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\User;
use Cake\Chronos\Chronos;
use Ecodev\Felix\Api\Exception;

class UserRepository extends AbstractRepository implements \Ecodev\Felix\Repository\LimitedAccessSubQuery
{
    /**
     * Returns the user authenticated by its login and password
     */
    public function getLoginPassword(string $login, string $password, string $site): ?User
    {
        /** @var User $user */
        $user = $this->getOneByLogin($login, $site);

        if (!$user) {
            return null;
        }

        if (($user->getActiveUntil() && $user->getActiveUntil() < new Chronos())) {
            throw new Exception("Ce compte n'est plus actif");
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
     */
    public function createShibboleth(string $login, string $email, string $site): User
    {
        $user = new User();
        $user->setLogin($login);
        $user->setEmail($email);
        $user->setType(User::TYPE_AAI);
        $user->setRole(User::ROLE_STUDENT);
        $user->setSite($site);

        _em()->persist($user);
        _em()->flush();

        return $user;
    }

    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     */
    public function getAccessibleSubQuery(?\Ecodev\Felix\Model\User $user): string
    {
        if ($user) {
            return $this->getAllIdsQuery();
        }

        return '-1';
    }
}
