<?php

declare(strict_types=1);

namespace Application\Api;

use Doctrine\ORM\EntityManager;
use GraphQL\Doctrine\Types;
use Laminas\ServiceManager\ServiceManager;
use Psr\Container\ContainerInterface;

class TypesFactory
{
    public function __invoke(ContainerInterface $container): Types
    {
        $entityManager = $container->get(EntityManager::class);

        $invokables = [
            Enum\UserRoleType::class,
            Input\CreateExportInputType::class,
            \Ecodev\Felix\Api\Input\PaginationInputType::class,
            MutationType::class,
            Output\GlobalPermissionsListType::class,
            Output\GlobalPermissionsType::class,
            \Ecodev\Felix\Api\Output\PermissionsType::class,
            QueryType::class,
            Scalar\LoginType::class,
            \Ecodev\Felix\Api\Scalar\EmailType::class,
            \Ecodev\Felix\Api\Scalar\ColorType::class,
            \Ecodev\Felix\Api\Scalar\UrlType::class,
            \GraphQL\Upload\UploadType::class,
            \Ecodev\Felix\Api\Scalar\ChronosType::class,
        ];

        $invokables = array_combine($invokables, $invokables);

        $aliases = [
            'datetime' => \Ecodev\Felix\Api\Scalar\ChronosType::class,
        ];

        $aliasesWithShortVariant = [
            \Cake\Chronos\Chronos::class => \Ecodev\Felix\Api\Scalar\ChronosType::class,
            \Psr\Http\Message\UploadedFileInterface::class => \GraphQL\Upload\UploadType::class,
        ];

        // Automatically add aliases and their short variants
        foreach ($aliasesWithShortVariant as $alias => $type) {
            $parts = explode('\\', $alias);
            $shortAlias = end($parts);

            $aliases[$alias] = $type;
            $aliases[$shortAlias] = $type;
        }

        // Automatically add aliases for GraphQL type name from the invokable types
        foreach ($invokables as $type) {
            $parts = explode('\\', $type);
            $alias = preg_replace('~Type$~', '', end($parts));
            $aliases[$alias] = $type;
        }

        $customTypes = new ServiceManager([
            'invokables' => $invokables,
            'aliases' => $aliases,
            'services' => [
                //                // This is not quite right because it allow to compare a string with a json array.
                //                // TODO: either hide the json filter or find a cleaner solution
                'json' => \GraphQL\Type\Definition\Type::string(),
            ],
            'abstract_factories' => [
                \Ecodev\Felix\Api\Output\PaginationTypeFactory::class,
                \Ecodev\Felix\Api\Enum\EnumAbstractFactory::class,
            ],
        ]);

        $types = new Types($entityManager, $customTypes);

        return $types;
    }
}
