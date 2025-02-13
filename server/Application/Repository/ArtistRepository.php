<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Enum\Site;
use Application\Model\Artist;

/**
 * @extends AbstractRepository<Artist>
 */
class ArtistRepository extends AbstractRepository
{
    /**
     * Get or create artists by their given names.
     *
     * @param string[] $names
     *
     * @return Artist[]
     */
    public function getOrCreateByNames(array $names, Site $site): array
    {
        if (!$names) {
            return [];
        }

        // Dedup and trim whitespaces
        $names = array_unique(array_map(fn ($value) => trim($value), $names));

        $artists = $this->findBy([
            'name' => $names,
            'site' => $site->value,
        ]);

        $found = [];
        foreach ($artists as $artist) {
            // Names are not trimmed when saved from thesaurus interface, so we
            // have names with trailing whitespace in the database.
            // With the collation we use, MariaDB trims whitespaces when doing
            // comparison (affecting UNIQUE constraint and SELECT queries).
            // So we must be sure to handle whitespaces in the same way as
            // MariaDB when doing comparisons.
            $found[] = trim($artist->getName());
        }

        $notFound = array_diff($names, $found);
        foreach ($notFound as $name) {
            $artist = new Artist();
            $artist->setSite($site);
            $this->getEntityManager()->persist($artist);
            $artist->setName($name);
            $artists[] = $artist;
        }

        return $artists;
    }
}
