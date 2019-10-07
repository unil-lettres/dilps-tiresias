<?php

declare(strict_types=1);

return [
    'doctrine' => [
        'connection' => [
            'orm_default' => [
                'driverClass' => Doctrine\DBAL\Driver\PDOMySql\Driver::class,
                'params' => [
                    'host' => 'localhost',
                    'dbname' => 'dilps',
                    'user' => 'dilps',
                    'password' => '',
                    'port' => 3306,
                    'driverOptions' => [
                        \PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8mb4',
                    ],
                    'defaultTableOptions' => [
                        'charset' => 'utf8mb4',
                        'collate' => 'utf8mb4_unicode_ci',
                    ],
                ],
            ],
        ],
        'driver' => [
            'orm_default' => [
                'class' => Doctrine\ORM\Mapping\Driver\AnnotationDriver::class,
                'cache' => 'array',
                'paths' => ['server/Application/Model'],
            ],
        ],
        'configuration' => [
            'orm_default' => [
                'naming_strategy' => \Doctrine\ORM\Mapping\UnderscoreNamingStrategy::class,
                'proxy_dir' => 'data/cache/DoctrineORMModule/Proxy',
                'generate_proxies' => false,
                'filters' => [
                    \Application\ORM\Query\Filter\AclFilter::class => \Application\ORM\Query\Filter\AclFilter::class,
                ],
                'numeric_functions' => [
                    'rand' => \DoctrineExtensions\Query\Mysql\Rand::class,
                ],
            ],
        ],
        'types' => [
            'UserType' => Application\DBAL\Types\UserTypeType::class,
            'Precision' => Application\DBAL\Types\PrecisionType::class,
            'Site' => Application\DBAL\Types\SiteType::class,
            'UserRole' => Application\DBAL\Types\UserRoleType::class,
            'ChangeType' => Application\DBAL\Types\ChangeTypeType::class,
            'CardVisibility' => Application\DBAL\Types\CardVisibilityType::class,
            'CollectionVisibility' => Application\DBAL\Types\CollectionVisibilityType::class,
        ],
        // migrations configuration
        'migrations_configuration' => [
            'orm_default' => [
                'directory' => 'server/Application/Migration',
                'namespace' => 'Application\Migration',
            ],
        ],
    ],
];
