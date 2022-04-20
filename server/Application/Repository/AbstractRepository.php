<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\AbstractModel;
use Doctrine\ORM\EntityRepository;
use Ecodev\Felix\Repository\Traits\Repository;

/**
 * @template T of AbstractModel
 * @extends EntityRepository<T>
 */
abstract class AbstractRepository extends EntityRepository
{
    use Repository;

    protected function quoteArray(array $values): string
    {
        $result = [];
        foreach ($values as $v) {
            $result[] = $this->getEntityManager()->getConnection()->quote($v);
        }

        return implode(', ', $result);
    }
}
