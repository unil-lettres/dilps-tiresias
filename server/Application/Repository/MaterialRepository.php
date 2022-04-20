<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Material;

/**
 * @extends AbstractRepository<Material>
 */
class MaterialRepository extends AbstractRepository
{
    use HasParent;
}
