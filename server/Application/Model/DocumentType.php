<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\DocumentTypeRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * A document type.
 */
#[ORM\Entity(DocumentTypeRepository::class)]
class DocumentType extends Thesaurus
{
}
