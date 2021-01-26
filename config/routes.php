<?php

declare(strict_types=1);

use Ecodev\Felix\Handler\GraphQLHandler;
use GraphQL\Upload\UploadMiddleware;
use Mezzio\Application;
use Mezzio\Helper\BodyParams\BodyParamsMiddleware;
use Mezzio\MiddlewareFactory;
use Psr\Container\ContainerInterface;

/**
 * Setup routes with a single request method:
 *
 * $app->get('/', App\Handler\HomePageHandler::class, 'home');
 * $app->post('/album', App\Handler\AlbumCreateHandler::class, 'album.create');
 * $app->put('/album/:id', App\Handler\AlbumUpdateHandler::class, 'album.put');
 * $app->patch('/album/:id', App\Handler\AlbumUpdateHandler::class, 'album.patch');
 * $app->delete('/album/:id', App\Handler\AlbumDeleteHandler::class, 'album.delete');
 *
 * Or with multiple request methods:
 *
 * $app->route('/contact', App\Handler\ContactHandler::class, ['GET', 'POST', ...], 'contact');
 *
 * Or handling all request methods:
 *
 * $app->route('/contact', App\Handler\ContactHandler::class)->setName('contact');
 *
 * or:
 *
 * $app->route(
 *     '/contact',
 *     App\Handler\ContactHandler::class,
 *     Mezzio\Router\Route::HTTP_METHOD_ANY,
 *     'contact'
 * );
 */
return function (Application $app, MiddlewareFactory $factory, ContainerInterface $container): void {
    /** @var \Mezzio\Application $app */
    $app->post('/graphql', [
        BodyParamsMiddleware::class,
        UploadMiddleware::class,
        GraphQLHandler::class,
    ], 'graphql');

    $app->get('/image/{id:\d+}[/{maxHeight:\d+}]', [
        \Application\Handler\ImageHandler::class,
    ], 'image');

    $app->get('/file/{id:\d+}[/{name}]', [
        \Ecodev\Felix\Handler\FileHandler::class,
    ], 'file');

    $app->get('/template', [
        \Application\Handler\TemplateHandler::class,
    ], 'template');

    $app->get('/auth', \Application\Handler\ShibbolethHandler::class);

    $app->get('/detail[/]', \Application\Handler\LegacyRedirectHandler::class);
};
