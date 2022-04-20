<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\AntiqueName;

/**
 * @extends AbstractRepository<AntiqueName>
 */
class AntiqueNameRepository extends AbstractRepository
{
    use HasName;
}
