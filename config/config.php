<?php

declare(strict_types=1);

use Application\Service\SiteFactory;
use Laminas\ConfigAggregator\ArrayProvider;
use Laminas\ConfigAggregator\ConfigAggregator;
use Laminas\ConfigAggregator\PhpFileProvider;

$site = SiteFactory::getSite(getenv('SERVER_NAME') ?: '');
$siteConfigFile = "config/autoload/$site.local.php";
$cacheConfigFile = "data/cache/config-cache.$site.php";

// To enable or disable caching, set the `ConfigAggregator::ENABLE_CACHE` boolean in
// `config/autoload/local.php`.
$cacheConfig = [
    'config_cache_path' => $cacheConfigFile,
];

$aggregator = new ConfigAggregator([
    Ecodev\Felix\ConfigProvider::class,
    Laminas\Diactoros\ConfigProvider::class,
    Mezzio\LaminasView\ConfigProvider::class,
    Laminas\Log\ConfigProvider::class,
    Laminas\Mail\ConfigProvider::class,
    Laminas\Validator\ConfigProvider::class,
    Mezzio\ConfigProvider::class,
    Mezzio\Helper\ConfigProvider::class,
    Mezzio\Router\FastRouteRouter\ConfigProvider::class,
    Mezzio\Router\ConfigProvider::class,
    Laminas\HttpHandlerRunner\ConfigProvider::class,
    Mezzio\Session\Ext\ConfigProvider::class,
    Mezzio\Session\ConfigProvider::class,
    // Include cache configuration
    new ArrayProvider($cacheConfig),
    // Default Application module config
    // Load application config in a pre-defined order in such a way that local settings
    // overwrite global settings. (Loaded as first to last):
    //   - `global.php`
    //   - `*.global.php`
    //   - `local.php`
    new PhpFileProvider('config/autoload/{{,*.}global,local}.php'),
    // Load site specific config if it exists
    new PhpFileProvider($siteConfigFile),
    // Load development config if it exists
    new PhpFileProvider('config/development.config.php'),
], $cacheConfig['config_cache_path']);

return $aggregator->getMergedConfig();
