<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\DocumentType;

/**
 * @extends AbstractRepository<DocumentType>
 */
class DocumentTypeRepository extends AbstractRepository
{
    use HasName;
}
