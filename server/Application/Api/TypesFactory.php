<?php

declare(strict_types=1);

namespace Application\Api;

use Cake\Chronos\Chronos;
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
            \Application\Api\Enum\CardVisibilityType::class,
            \Application\Api\Enum\ChangeTypeType::class,
            \Application\Api\Enum\CollectionVisibilityType::class,
            \Application\Api\Enum\ExportFormatType::class,
            \Application\Api\Enum\ExportStatusType::class,
            \Application\Api\Enum\OrderType::class,
            \Application\Api\Enum\PrecisionType::class,
            \Application\Api\Enum\SiteType::class,
            \Application\Api\Enum\UserRoleType::class,
            \Application\Api\Enum\UserTypeType::class,
            \Application\Api\Input\CreateExportInputType::class,
            \Ecodev\Felix\Api\Input\PaginationInputType::class,
            \Application\Api\MutationType::class,
            \Application\Api\Output\GlobalPermissionsListType::class,
            \Application\Api\Output\GlobalPermissionsType::class,
            \Ecodev\Felix\Api\Output\PermissionsType::class,
            \Application\Api\QueryType::class,
            \Application\Api\Scalar\LoginType::class,
            \Ecodev\Felix\Api\Scalar\EmailType::class,
            \Ecodev\Felix\Api\Scalar\ColorType::class,
            \Ecodev\Felix\Api\Scalar\UrlType::class,
            \GraphQL\Upload\UploadType::class,
            \Ecodev\Felix\Api\Scalar\ChronosType::class,
        ];

        $aliases = [
            \Cake\Chronos\Chronos::class => \Ecodev\Felix\Api\Scalar\ChronosType::class,
            'datetime' => \Ecodev\Felix\Api\Scalar\ChronosType::class,
        ];

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
            ],
        ]);

        $types = new Types($entityManager, $customTypes);

        return $types;
    }
}
