<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Repository\ArtistRepository;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Api\Exception;

/**
 * An artist.
 */
#[ORM\UniqueConstraint(name: 'unique_name', columns: ['name'])]
#[ORM\Entity(ArtistRepository::class)]
class Artist extends Thesaurus
{
    public function setName(string $name): void
    {
        /** @var ArtistRepository $artistRepository */
        $artistRepository = _em()->getRepository(self::class);

        $exists = $artistRepository->findOneBy(['name' => $name]);
        if ($exists && $exists->getId() !== $this->getId()) {
            throw new Exception('Le nom de cet artiste existe déjà.');
        }
        parent::setName($name);
    }
}
