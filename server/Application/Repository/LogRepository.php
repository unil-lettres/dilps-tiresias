<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Log;

/**
 * @extends AbstractRepository<Log>
 */
class LogRepository extends AbstractRepository implements \Ecodev\Felix\Repository\LogRepository
{
    use \Ecodev\Felix\Repository\Traits\LogRepository;
}
