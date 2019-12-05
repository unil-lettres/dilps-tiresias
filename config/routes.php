<?php

declare(strict_types=1);

use Application\Action\GraphQLAction;
use GraphQL\Upload\UploadMiddleware;
use Psr\Container\ContainerInterface;
use Zend\Expressive\Application;
use Zend\Expressive\Helper\BodyParams\BodyParamsMiddleware;
use Zend\Expressive\MiddlewareFactory;

/*
 * Setup routes with a single request method:
 *
 * $app->get('/', Application\Action\HomePageAction::class, 'home');
 * $app->post('/album', Application\Action\AlbumCreateAction::class, 'album.create');
 * $app->put('/album/:id', Application\Action\AlbumUpdateAction::class, 'album.put');
 * $app->patch('/album/:id', Application\Action\AlbumUpdateAction::class, 'album.patch');
 * $app->delete('/album/:id', Application\Action\AlbumDeleteAction::class, 'album.delete');
 *
 * Or with multiple request methods:
 *
 * $app->route('/contact', Application\Action\ContactAction::class, ['GET', 'POST', ...], 'contact');
 *
 * Or handling all request methods:
 *
 * $app->route('/contact', Application\Action\ContactAction::class)->setName('contact');
 *
 * or:
 *
 * $app->route(
 *     '/contact',
 *     Application\Action\ContactAction::class,
 *     Zend\Expressive\Router\Route::HTTP_METHOD_ANY,
 *     'contact'
 * );
 */

return function (Application $app, MiddlewareFactory $factory, ContainerInterface $container): void {
    /** @var \Zend\Expressive\Application $app */
    $app->post('/graphql', [
        BodyParamsMiddleware::class,
        UploadMiddleware::class,
        GraphQLAction::class,
    ], 'graphql');

    $app->get('/image/{id:\d+}[/{maxHeight:\d+}]', [
        \Application\Action\ImageAction::class,
    ], 'image');

    $app->get('/pptx/{ids:\d+[,\d]*}[/{backgroundColor:[\da-fA-F]{8}}[/{textColor:[\da-fA-F]{8}}]]', [
        \Application\Middleware\CardsFetcherMiddleware::class,
        \Application\Action\PptxAction::class,
    ], 'pptx');

    $app->get('/xlsx/{ids:\d+[,\d]*}', [
        \Application\Middleware\CardsFetcherMiddleware::class,
        \Application\Action\XlsxAction::class,
    ], 'xlsx');

    $app->get('/zip/{ids:\d+[,\d]*}[/{includeLegend:0|1}[/{maxHeight:\d+}]]', [
        \Application\Middleware\CardsFetcherMiddleware::class,
        \Application\Action\ZipAction::class,
    ], 'zip');

    $app->get('/pptx/collection/{ids:\d+[,\d]*}[/{backgroundColor:[\da-fA-F]{8}}[/{textColor:[\da-fA-F]{8}}]]', [
        \Application\Middleware\CollectionFetcherMiddleware::class,
        \Application\Action\PptxAction::class,
    ], 'pptx/collection');

    $app->get('/xlsx/collection/{ids:\d+[,\d]*}', [
        \Application\Middleware\CollectionFetcherMiddleware::class,
        \Application\Action\XlsxAction::class,
    ], 'xlsx/collection');

    $app->get('/zip/collection/{ids:\d+[,\d]*}[/{includeLegend:0|1}[/{maxHeight:\d+}]]', [
        \Application\Middleware\CollectionFetcherMiddleware::class,
        \Application\Action\ZipAction::class,
    ], 'zip/collection');

    $app->get('/template', [
        \Application\Action\TemplateAction::class,
    ], 'template');

    $app->get('/auth', \Application\Middleware\ShibbolethMiddleware::class);
};
