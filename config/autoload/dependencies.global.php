<?php

declare(strict_types=1);

return [
    // Provides application-wide services.
    // We recommend using fully-qualified class names whenever possible as
    // service names.
    'dependencies' => [
        // Use 'aliases' to alias a service name to another service. The
        // key is the alias name, the value is the service to which it points.
        'aliases' => [
            \Doctrine\ORM\EntityManager::class => 'doctrine.entity_manager.orm_default',
        ],
        // Use 'invokables' for constructor-less services, or services that do
        // not require arguments to the constructor. Map a service name to the
        // class name.
        'invokables' => [
            // Fully\Qualified\InterfaceName::class => Fully\Qualified\ClassName::class,
            \Zend\Expressive\Helper\ServerUrlHelper::class => \Zend\Expressive\Helper\ServerUrlHelper::class,
            \Doctrine\ORM\Mapping\UnderscoreNamingStrategy::class => \Doctrine\ORM\Mapping\UnderscoreNamingStrategy::class,
            \Application\DBAL\FileLogger::class => \Application\DBAL\FileLogger::class,
        ],
        // Use 'factories' for services provided by callbacks/factory classes.
        'factories' => [
            'site' => \Application\Service\SiteFactory::class,
            \Zend\Expressive\Application::class => \Zend\Expressive\Container\ApplicationFactory::class,
            \Zend\Expressive\Helper\ServerUrlMiddleware::class => \Zend\Expressive\Helper\ServerUrlMiddlewareFactory::class,
            \Zend\Expressive\Helper\UrlHelper::class => \Zend\Expressive\Helper\UrlHelperFactory::class,
            \Zend\Expressive\Helper\UrlHelperMiddleware::class => \Zend\Expressive\Helper\UrlHelperMiddlewareFactory::class,

            \Zend\Stratigility\Middleware\ErrorHandler::class => \Zend\Expressive\Container\ErrorHandlerFactory::class,
            \Zend\Expressive\Middleware\ErrorResponseGenerator::class => \Zend\Expressive\Container\ErrorResponseGeneratorFactory::class,
            \Zend\Expressive\Handler\NotFoundHandler::class => \Zend\Expressive\Container\NotFoundHandlerFactory::class,
            'doctrine.entity_manager.orm_default' => \Application\ORM\EntityManagerFactory::class,
            \Application\Action\GraphQLAction::class => \Application\Action\GraphQLFactory::class,
            \Application\Action\ImageAction::class => \Application\Action\ImageFactory::class,
            \Application\Action\PptxAction::class => \Application\Action\PptxFactory::class,
            \Application\Action\XlsxAction::class => \Application\Action\XlsxFactory::class,
            \Application\Action\TemplateAction::class => \Application\Action\TemplateFactory::class,
            \Application\Action\ZipAction::class => \Application\Action\ZipFactory::class,
            \Application\Middleware\CardsFetcherMiddleware::class => \Application\Middleware\CardsFetcherFactory::class,
            \Application\Middleware\CollectionFetcherMiddleware::class => \Application\Middleware\CollectionFetcherFactory::class,
            \Application\Service\ImageService::class => \Application\Service\ImageFactory::class,
            \Application\Middleware\AuthenticationMiddleware::class => \Application\Middleware\AuthenticationFactory::class,
            \Application\Middleware\ShibbolethMiddleware::class => \Application\Middleware\ShibbolethFactory::class,
            \GraphQL\Doctrine\Types::class => \Application\Api\TypesFactory::class,
            \Imagine\Image\ImagineInterface::class => \Application\Service\ImagineFactory::class,
        ],
    ],
];
