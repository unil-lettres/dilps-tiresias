<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Tag;

/**
 * @extends AbstractRepository<Tag>
 */
class TagRepository extends AbstractRepository
{
    use HasParent;
}
