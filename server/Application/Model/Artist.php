<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\ArtistRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * An artist.
 */
#[ORM\UniqueConstraint(name: 'unique_name', columns: ['name'])]
#[ORM\Entity(ArtistRepository::class)]
class Artist extends Thesaurus
{
}
