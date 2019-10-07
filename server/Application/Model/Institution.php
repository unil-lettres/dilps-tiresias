<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasAddress;
use Application\Traits\HasName;
use Application\Traits\HasSite;
use Doctrine\ORM\Mapping as ORM;

/**
 * An institution
 *
 * @ORM\Entity(repositoryClass="Application\Repository\InstitutionRepository")
 * @ORM\Table(indexes={
 *     @ORM\Index(name="institution_locality_idx", columns={"locality"}),
 *     @ORM\Index(name="institution_area_idx", columns={"area"}),
 *     @ORM\Index(name="institution_latitude_idx", columns={"latitude"}),
 *     @ORM\Index(name="institution_longitude_idx", columns={"longitude"}),
 * },
 * uniqueConstraints={
 *     @ORM\UniqueConstraint(name="unique_name", columns={"name", "site"})
 * })
 */
class Institution extends AbstractModel
{
    use HasName;
    use HasAddress;
    use HasSite;
}
