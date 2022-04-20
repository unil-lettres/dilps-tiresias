<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Period;

/**
 * @extends AbstractRepository<Period>
 */
class PeriodRepository extends AbstractRepository
{
    use HasParent;
}
