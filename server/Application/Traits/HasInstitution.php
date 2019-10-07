<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Model\Institution;
use Doctrine\ORM\Mapping as ORM;

/**
 * Trait for all objects belonging to an institution
 */
trait HasInstitution
{
    /**
     * @var null|Institution
     * @ORM\ManyToOne(targetEntity="Institution")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="SET NULL")
     * })
     */
    private $institution;

    /**
     * Get the institution this object belongs to
     *
     * @return null|Institution
     */
    public function getInstitution(): ?Institution
    {
        return $this->institution;
    }

    /**
     * Set name of the institution this object belongs to.
     *
     * If the institution does not yet exist, it will be created automatically.
     *
     * @param null|string $institutionName
     */
    public function setInstitution(?string $institutionName): void
    {
        // Ignore change if it already is the same name
        $institution = $this->getInstitution();
        if ($institution && $institution->getName() === $institutionName) {
            return;
        }

        $this->institution = _em()->getRepository(Institution::class)->getOrCreateByName($institutionName, $this->getSite());
    }
}
