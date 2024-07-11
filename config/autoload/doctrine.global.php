<?php

declare(strict_types=1);

return [
    'doctrine' => [
        'connection' => [
            'orm_default' => [
                'driverClass' => Doctrine\DBAL\Driver\PDO\MySQL\Driver::class,
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
                'class' => Doctrine\ORM\Mapping\Driver\AttributeDriver::class,
                'cache' => 'array',
                'paths' => ['server/Application/Model'],
            ],
        ],
        'configuration' => [
            'orm_default' => [
                'naming_strategy' => Doctrine\ORM\Mapping\UnderscoreNamingStrategy::class,
                'proxy_dir' => getcwd() . '/data/cache/DoctrineORMModule/Proxy',
                'generate_proxies' => false,
                'filters' => [
                    Ecodev\Felix\ORM\Query\Filter\AclFilter::class => Ecodev\Felix\ORM\Query\Filter\AclFilter::class,
                ],
                'numeric_functions' => [
                    'rand' => DoctrineExtensions\Query\Mysql\Rand::class,
                    'native_in' => Ecodev\Felix\ORM\Query\NativeIn::class,
                    'geomfromtext' => LongitudeOne\Spatial\ORM\Query\AST\Functions\Standard\StGeomFromText::class,
                    'st_distance' => LongitudeOne\Spatial\ORM\Query\AST\Functions\Standard\StDistance::class,
                ],
                'string_functions' => [
                    'match' => DoctrineExtensions\Query\Mysql\MatchAgainst::class,
                ],
            ],
        ],
        'types' => [
            'MessageType' => Application\DBAL\Types\MessageTypeType::class,
            'UserRole' => Application\DBAL\Types\UserRoleType::class,
            'datetime' => Ecodev\Felix\DBAL\Types\ChronosType::class,
            'point' => LongitudeOne\Spatial\DBAL\Types\Geography\PointType::class,
        ],
        // migrations configuration
        'migrations' => [
            'orm_default' => [
                'table_storage' => [
                    'table_name' => 'doctrine_migration_versions',
                ],
                'custom_template' => 'config/migration-template.txt',
                'migrations_paths' => [
                    'Application\Migration' => 'server/Application/Migration',
                ],
            ],
        ],
    ],
];
