<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasName;
use Doctrine\ORM\Mapping as ORM;

/**
 * An document type.
 *
 * @ORM\Entity(repositoryClass="Application\Repository\DocumentTypeRepository")
 */
class DocumentType extends AbstractModel
{
    use HasName;
}
