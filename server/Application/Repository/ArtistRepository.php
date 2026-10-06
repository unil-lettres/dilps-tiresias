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

        // Dedup and trim whitespaces, and ignore empty names, an artist without name would be useless
        $names = array_unique(array_filter(array_map(fn ($value) => mb_trim($value), $names), fn ($value) => $value !== ''));
        if (!$names) {
            return [];
        }

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
            $found[] = mb_trim($artist->getName());
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
