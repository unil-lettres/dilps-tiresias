<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\AntiqueNameRepository;
use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;

/**
 * An antique / ancient name.
 */
#[ORM\Entity(AntiqueNameRepository::class)]
class AntiqueName extends AbstractModel implements HasSiteInterface
{
    use HasName;
    use HasSite;
}
