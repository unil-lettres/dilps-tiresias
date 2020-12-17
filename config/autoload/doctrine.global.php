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
                        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8mb4',
                    ],
                    'defaultTableOptions' => [
                        'charset' => 'utf8mb4',
                        'collate' => 'utf8mb4_unicode_ci',
                    ],
                ],

                'doctrine_mapping_types' => [
                    'point' => 'point',
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
                    \Ecodev\Felix\ORM\Query\Filter\AclFilter::class => \Ecodev\Felix\ORM\Query\Filter\AclFilter::class,
                ],
                'numeric_functions' => [
                    'rand' => \DoctrineExtensions\Query\Mysql\Rand::class,
                    'native_in' => \Application\ORM\Query\NativeIn::class,
                    'geomfromtext' => CrEOF\Spatial\ORM\Query\AST\Functions\MySql\GeomFromText::class,
                    'st_distance' => CrEOF\Spatial\ORM\Query\AST\Functions\MySql\STDistance::class,
                ],
            ],
        ],
        'types' => [
            'CardVisibility' => Application\DBAL\Types\CardVisibilityType::class,
            'ChangeType' => Application\DBAL\Types\ChangeTypeType::class,
            'CollectionVisibility' => Application\DBAL\Types\CollectionVisibilityType::class,
            'ExportFormat' => Application\DBAL\Types\ExportFormatType::class,
            'ExportState' => Application\DBAL\Types\ExportStateType::class,
            'Precision' => Application\DBAL\Types\PrecisionType::class,
            'Site' => Application\DBAL\Types\SiteType::class,
            'UserRole' => Application\DBAL\Types\UserRoleType::class,
            'UserType' => Application\DBAL\Types\UserTypeType::class,
            'datetime' => Ecodev\Felix\DBAL\Types\ChronosType::class,
            'point' => CrEOF\Spatial\DBAL\Types\Geography\PointType::class,
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
