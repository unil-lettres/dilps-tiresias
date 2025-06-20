<?php

declare(strict_types=1);

return [
    // Provides application-wide services.
    // We recommend using fully-qualified class names whenever possible as
    // service names.
    'dependencies' => [
        // Use 'invokables' for constructor-less services, or services that do
        // not require arguments to the constructor. Map a service name to the
        // class name.
        'invokables' => [
            // Fully\Qualified\InterfaceName::class => Fully\Qualified\ClassName::class,
            Mezzio\Helper\ServerUrlHelper::class,
            Doctrine\ORM\Mapping\UnderscoreNamingStrategy::class,
        ],
        // Use 'factories' for services provided by callbacks/factory classes.
        'factories' => [
            'doctrine.entity_manager.orm_default' => Application\ORM\EntityManagerFactory::class,
            'site' => Application\Service\SiteFactory::class,
            Application\Handler\ImageHandler::class => Application\Handler\ImageFactory::class,
            Application\Handler\LegacyRedirectHandler::class => Application\Handler\LegacyRedirectFactory::class,
            Application\Handler\ShibbolethHandler::class => Application\Handler\ShibbolethFactory::class,
            Application\Handler\TemplateHandler::class => Application\Handler\TemplateFactory::class,
            Application\Middleware\AuthenticationMiddleware::class => Application\Middleware\AuthenticationFactory::class,
            Application\Middleware\RefreshSessionTimestampMiddleware::class => Application\Middleware\RefreshSessionTimestampMiddlewareFactory::class,
            Application\Service\Exporter\Csv::class => Application\Service\Exporter\CsvFactory::class,
            Application\Service\Exporter\Exporter::class => Application\Service\Exporter\ExporterFactory::class,
            Application\Service\Exporter\Pptx::class => Application\Service\Exporter\PptxFactory::class,
            Application\Service\Exporter\Zip::class => Application\Service\Exporter\ZipFactory::class,
            Application\Service\MessageQueuer::class => Application\Service\MessageQueuerFactory::class,
            Application\Service\ImageResizer::class => Application\Service\ImageResizerFactory::class,
            Ecodev\Felix\Handler\FileHandler::class => Application\Handler\FileFactory::class,
            Ecodev\Felix\Handler\GraphQLHandler::class => Application\Handler\GraphQLFactory::class,
            Ecodev\Felix\Service\Mailer::class => Application\Service\MailerFactory::class,
            GraphQL\Doctrine\Types::class => Application\Api\TypesFactory::class,
            Laminas\Stratigility\Middleware\ErrorHandler::class => Mezzio\Container\ErrorHandlerFactory::class,
            Mezzio\Application::class => Mezzio\Container\ApplicationFactory::class,
            Mezzio\Handler\NotFoundHandler::class => Mezzio\Container\NotFoundHandlerFactory::class,
            Mezzio\Helper\ServerUrlMiddleware::class => Mezzio\Helper\ServerUrlMiddlewareFactory::class,
            Mezzio\Helper\UrlHelper::class => Mezzio\Helper\UrlHelperFactory::class,
            Mezzio\Helper\UrlHelperMiddleware::class => Mezzio\Helper\UrlHelperMiddlewareFactory::class,
            Mezzio\Middleware\ErrorResponseGenerator::class => Mezzio\Container\ErrorResponseGeneratorFactory::class,
        ],
    ],
];
