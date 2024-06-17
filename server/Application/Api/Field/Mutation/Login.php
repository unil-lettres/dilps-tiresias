<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Scalar\LoginType;
use Application\Model\Statistic;
use Application\Model\User;
use Application\Repository\StatisticRepository;
use Application\Repository\UserRepository;
use Ecodev\Felix\Api\Exception;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Type\Definition\Type;
use Mezzio\Session\SessionInterface;

abstract class Login implements FieldInterface
{
    public static function build(): iterable
    {
        yield 'login' => fn () => [
            'type' => Type::nonNull(_types()->getOutput(User::class)),
            'description' => 'Log in a user',
            'args' => [
                'login' => Type::nonNull(_types()->get(LoginType::class)),
                'password' => Type::nonNull(Type::string()),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): User {
                $site = $root['site'];

                // Logout
                $session->clear();
                User::setCurrent(null);

                /** @var UserRepository $userRepository */
                $userRepository = _em()->getRepository(User::class);
                $user = $userRepository->getLoginPassword($args['login'], $args['password'], $site);

                // If we successfully authenticated or we already were logged in, keep going
                if ($user) {
                    $session->regenerate();
                    $session->set('user', $user->getId());
                    User::setCurrent($user);

                    /** @var StatisticRepository $statisticRepository */
                    $statisticRepository = _em()->getRepository(Statistic::class);
                    $statistic = $statisticRepository->getOrCreate($site);
                    $statistic->recordLogin();

                    _em()->flush();

                    return $user;
                }

                throw new Exception("Le nom d'utilisateur ou mot de passe est incorrect");
            },
        ];
    }
}
