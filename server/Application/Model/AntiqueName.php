<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasName;
use Doctrine\ORM\Mapping as ORM;

/**
 * An antique / ancient name
 *
 * @ORM\Entity(repositoryClass="Application\Repository\AntiqueNameRepository")
 */
class AntiqueName extends AbstractModel
{
    use HasName;
}
