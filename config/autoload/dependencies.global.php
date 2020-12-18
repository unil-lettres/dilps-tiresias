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
            \Mezzio\Helper\ServerUrlHelper::class,
            \Doctrine\ORM\Mapping\UnderscoreNamingStrategy::class,
            \Ecodev\Felix\DBAL\Logging\ForwardSQLLogger::class,
        ],
        // Use 'factories' for services provided by callbacks/factory classes.
        'factories' => [
            'site' => \Application\Service\SiteFactory::class,
            \Mezzio\Application::class => \Mezzio\Container\ApplicationFactory::class,
            \Mezzio\Helper\ServerUrlMiddleware::class => \Mezzio\Helper\ServerUrlMiddlewareFactory::class,
            \Mezzio\Helper\UrlHelper::class => \Mezzio\Helper\UrlHelperFactory::class,
            \Mezzio\Helper\UrlHelperMiddleware::class => \Mezzio\Helper\UrlHelperMiddlewareFactory::class,
            \Laminas\Stratigility\Middleware\ErrorHandler::class => \Mezzio\Container\ErrorHandlerFactory::class,
            \Mezzio\Middleware\ErrorResponseGenerator::class => \Mezzio\Container\ErrorResponseGeneratorFactory::class,
            \Mezzio\Handler\NotFoundHandler::class => \Mezzio\Container\NotFoundHandlerFactory::class,
            'doctrine.entity_manager.orm_default' => \Application\ORM\EntityManagerFactory::class,
            \Application\Handler\GraphQLHandler::class => \Application\Handler\GraphQLFactory::class,
            \Application\Handler\ImageHandler::class => \Application\Handler\ImageFactory::class,
            \Application\Handler\TemplateHandler::class => \Application\Handler\TemplateFactory::class,
            \Application\Middleware\CardsFetcherMiddleware::class => \Application\Middleware\CardsFetcherFactory::class,
            \Application\Middleware\CollectionFetcherMiddleware::class => \Application\Middleware\CollectionFetcherFactory::class,
            \Ecodev\Felix\Service\ImageResizer::class => \Ecodev\Felix\Service\ImageResizerFactory::class,
            \Application\Middleware\AuthenticationMiddleware::class => \Application\Middleware\AuthenticationFactory::class,
            \Application\Handler\ShibbolethHandler::class => \Application\Handler\ShibbolethFactory::class,
            \Application\Handler\LegacyRedirectHandler::class => \Application\Handler\LegacyRedirectFactory::class,
            \GraphQL\Doctrine\Types::class => \Application\Api\TypesFactory::class,
            \Imagine\Image\ImagineInterface::class => \Ecodev\Felix\Service\ImagineFactory::class,
            \Laminas\Log\LoggerInterface::class => \Ecodev\Felix\Log\LoggerFactory::class,
            \Ecodev\Felix\Log\Writer\Db::class => \Application\Log\DbWriterFactory::class,
            \Ecodev\Felix\Log\EventCompleter::class => \Ecodev\Felix\Log\EventCompleterFactory::class,
            \Ecodev\Felix\Log\Writer\Mail::class => \Ecodev\Felix\Log\Writer\MailFactory::class,
            \Ecodev\Felix\Handler\FileHandler::class => \Application\Handler\FileFactory::class,
            \Application\Service\Exporter\Exporter::class => \Application\Service\Exporter\ExporterFactory::class,
            \Application\Service\Exporter\Zip::class => \Application\Service\Exporter\ZipFactory::class,
            \Application\Service\Exporter\Pptx::class => \Application\Service\Exporter\PptxFactory::class,
            \Application\Service\Exporter\Xlsx::class => \Application\Service\Exporter\XlsxFactory::class,
            \Application\Service\MessageQueuer::class => \Application\Service\MessageQueuerFactory::class,
            \Ecodev\Felix\Service\MessageRenderer::class => \Ecodev\Felix\Service\MessageRendererFactory::class,
            \Ecodev\Felix\Service\Mailer::class => \Application\Service\MailerFactory::class,
            \Laminas\View\Renderer\RendererInterface::class => \Ecodev\Felix\Service\RendererFactory::class,
            \Laminas\Mail\Transport\TransportInterface::class => \Ecodev\Felix\Service\TransportFactory::class,
        ],
    ],
];
