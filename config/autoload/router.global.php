<?php

declare(strict_types=1);

use Mezzio\Router\FastRouteRouter;
use Mezzio\Router\RouterInterface;

return [
    'dependencies' => [
        'invokables' => [
            RouterInterface::class => FastRouteRouter::class,
        ],
    ],
];
