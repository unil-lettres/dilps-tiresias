<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\ArtistRepository;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;

/**
 * An artist.
 */
#[ORM\UniqueConstraint(name: 'unique_name', columns: ['name'])]
#[ORM\Entity(ArtistRepository::class)]
class Artist extends AbstractModel implements HasSiteInterface
{
    use HasName;
    use HasSite;
}
