<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\InstitutionRepository;
use Application\Traits\HasAddress;
use Doctrine\ORM\Mapping as ORM;

/**
 * An institution.
 */
#[ORM\Index(name: 'institution_locality_idx', columns: ['locality'])]
#[ORM\Index(name: 'institution_area_idx', columns: ['area'])]
#[ORM\Index(name: 'FULLTEXT__INSTITUTION_NAME', flags: ['fulltext'], fields: ['name'])]
#[ORM\Index(name: 'FULLTEXT__INSTITUTION_LOCALITY', flags: ['fulltext'], fields: ['locality'])]
#[ORM\UniqueConstraint(name: 'unique_name', columns: ['name', 'site'])]
#[ORM\Entity(InstitutionRepository::class)]
class Institution extends Thesaurus
{
    use HasAddress;
}
