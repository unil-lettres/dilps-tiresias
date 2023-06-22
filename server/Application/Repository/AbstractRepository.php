<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\AbstractModel;
use Doctrine\ORM\EntityRepository;
use Ecodev\Felix\Repository\Traits\Repository;

/**
 * @template T of AbstractModel
 *
 * @extends EntityRepository<T>
 */
abstract class AbstractRepository extends EntityRepository
{
    use Repository;
}
