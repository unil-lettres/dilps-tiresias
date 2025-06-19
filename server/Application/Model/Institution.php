<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\InstitutionRepository;
use Application\Traits\HasAddress;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Api\Exception;

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

    public function setName(string $name): void
    {
        /** @var InstitutionRepository $institutionRepository */
        $institutionRepository = _em()->getRepository(self::class);

        $exists = $institutionRepository->findOneBy(['name' => $name]);
        if ($exists && $exists->getId() !== $this->getId()) {
            throw new Exception('Le nom de cette institution existe déjà.');
        }
        parent::setName($name);
    }
}
