<?php

declare(strict_types=1);

use Doctrine\ORM\EntityManager;
use Ecodev\Felix\ORM\Query\Filter\AclFilter;

require_once 'vendor/autoload.php';
$container = require 'config/container.php';

/** @var EntityManager $entityManager */
$entityManager = $container->get(EntityManager::class);

// Disable all ACL filters to be able to access anything
/** @var AclFilter $aclFilter */
$aclFilter = $entityManager->getFilters()->getFilter(AclFilter::class);
$aclFilter->disableForever();

return $container;
