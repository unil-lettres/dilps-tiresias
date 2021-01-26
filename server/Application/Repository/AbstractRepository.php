<?php

declare(strict_types=1);

namespace Application\Repository;

use Doctrine\ORM\EntityRepository;
use Ecodev\Felix\Repository\Traits\Repository;

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
