<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\InstitutionRepository;
use Application\Traits\HasAddress;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;

/**
 * An institution.
 */
#[ORM\Index(name: 'institution_locality_idx', columns: ['locality'])]
#[ORM\Index(name: 'institution_area_idx', columns: ['area'])]
#[ORM\UniqueConstraint(name: 'unique_name', columns: ['name', 'site'])]
#[ORM\Entity(InstitutionRepository::class)]
class Institution extends AbstractModel implements HasSiteInterface
{
    use HasAddress;
    use HasName;
    use HasSite;
}
