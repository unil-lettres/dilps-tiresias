<?php

declare(strict_types=1);

use Application\Handler\GraphQLHandler;
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

    $app->get('/pptx/{ids:\d+[,\d]*}[/{backgroundColor:[\da-fA-F]{8}}[/{textColor:[\da-fA-F]{8}}]]', [
        \Application\Middleware\CardsFetcherMiddleware::class,
        \Application\Handler\PptxHandler::class,
    ], 'pptx');

    $app->get('/xlsx/{ids:\d+[,\d]*}', [
        \Application\Middleware\CardsFetcherMiddleware::class,
        \Application\Handler\XlsxHandler::class,
    ], 'xlsx');

    $app->get('/zip/{ids:\d+[,\d]*}[/{includeLegend:0|1}[/{maxHeight:\d+}]]', [
        \Application\Middleware\CardsFetcherMiddleware::class,
        \Application\Handler\ZipHandler::class,
    ], 'zip');

    $app->get('/pptx/collection/{ids:\d+[,\d]*}[/{backgroundColor:[\da-fA-F]{8}}[/{textColor:[\da-fA-F]{8}}]]', [
        \Application\Middleware\CollectionFetcherMiddleware::class,
        \Application\Handler\PptxHandler::class,
    ], 'pptx/collection');

    $app->get('/xlsx/collection/{ids:\d+[,\d]*}', [
        \Application\Middleware\CollectionFetcherMiddleware::class,
        \Application\Handler\XlsxHandler::class,
    ], 'xlsx/collection');

    $app->get('/zip/collection/{ids:\d+[,\d]*}[/{includeLegend:0|1}[/{maxHeight:\d+}]]', [
        \Application\Middleware\CollectionFetcherMiddleware::class,
        \Application\Handler\ZipHandler::class,
    ], 'zip/collection');

    $app->get('/template', [
        \Application\Handler\TemplateHandler::class,
    ], 'template');

    $app->get('/auth', \Application\Handler\ShibbolethHandler::class);

    $app->get('/detail[/]', \Application\Handler\LegacyRedirectHandler::class);
};
