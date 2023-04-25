<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\DocumentTypeRepository;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;

/**
 * An document type.
 */
#[ORM\Entity(DocumentTypeRepository::class)]
class DocumentType extends AbstractModel implements HasSiteInterface
{
    use HasName;
    use HasSite;
}
