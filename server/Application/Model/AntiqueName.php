<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\AntiqueNameRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * An antique / ancient name.
 */
#[ORM\Entity(AntiqueNameRepository::class)]
class AntiqueName extends Thesaurus
{
}
