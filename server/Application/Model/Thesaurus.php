<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;

#[ORM\MappedSuperclass]
abstract class Thesaurus extends AbstractModel implements HasSiteInterface
{
    use HasName;
    use HasSite;

    #[ORM\Column(type: 'integer', options: ['default' => 0, 'unsigned' => true])]
    private int $usageCount = 0;

    /**
     * The nb of cards that use this thesaurus.
     *
     * Computed by DB triggers.
     */
    public function getUsageCount(): int
    {
        return $this->usageCount;
    }
}
