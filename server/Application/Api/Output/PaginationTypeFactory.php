<?php

declare(strict_types=1);

namespace Application\Api\Output;

use Application\Model\AbstractModel;
use Interop\Container\ContainerInterface;
use Laminas\ServiceManager\Factory\AbstractFactoryInterface;

/**
 * Create a Pagination type for the entity extracted from name.
 *
 * For example, if given "ActionPagination", it will create a Pagination
 * type for the Action entity.
 */
class PaginationTypeFactory implements AbstractFactoryInterface
{
    private const PATTERN = '~^(.*)Pagination$~';

    public function canCreate(ContainerInterface $container, $requestedName): bool
    {
        $class = $this->getClass($requestedName);

        return $class && is_a($class, AbstractModel::class, true);
    }

    public function __invoke(ContainerInterface $container, $requestedName, ?array $options = null): PaginationType
    {
        $class = $this->getClass($requestedName);
        $type = new PaginationType($class, $requestedName);

        return $type;
    }

    private function getClass(string $requestedName): ?string
    {
        if (preg_match(self::PATTERN, $requestedName, $m)) {
            return 'Application\Model\\' . $m[1];
        }

        return null;
    }
}
