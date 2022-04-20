<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Domain;

/**
 * @extends AbstractRepository<Domain>
 */
class DomainRepository extends AbstractRepository
{
    use HasParent;
}
