<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Model\Institution;
use Application\Repository\InstitutionRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * Trait for all objects belonging to an institution.
 */
trait HasInstitution
{
    /**
     * @var null|Institution
     */
    #[ORM\JoinColumn(onDelete: 'SET NULL')]
    #[ORM\ManyToOne(targetEntity: Institution::class)]
    private $institution;

    abstract public function getSite(): string;

    /**
     * Get the institution this object belongs to.
     */
    public function getInstitution(): ?Institution
    {
        return $this->institution;
    }

    /**
     * Set name of the institution this object belongs to.
     *
     * If the institution does not yet exist, it will be created automatically.
     */
    public function setInstitution(?string $institutionName): void
    {
        // Ignore change if it already is the same name
        $institution = $this->getInstitution();
        if ($institution && $institution->getName() === $institutionName) {
            return;
        }

        /** @var InstitutionRepository $institutionRepository */
        $institutionRepository = _em()->getRepository(Institution::class);
        $this->institution = $institutionRepository->getOrCreateByName($institutionName, $this->getSite());
    }
}
