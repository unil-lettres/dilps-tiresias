<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Artist;
use Doctrine\ORM\QueryBuilder;

class ArtistRepository extends AbstractRepository
{
    public function getFindAllQuery(array $filters = [], array $sorting = []): QueryBuilder
    {
        $qb = $this->createQueryBuilder('artist');

        $this->applySearch($qb, $filters, 'artist');
        $this->applySorting($qb, $sorting, 'artist');

        return $qb;
    }

    /**
     * Get or create artists by their given names
     *
     * @param string[] $names
     * @param string $site
     *
     * @return Artist[]
     */
    public function getOrCreateByNames(array $names, string $site): array
    {
        if (!$names) {
            return [];
        }

        // Dedup and trim whitespaces
        $names = array_unique(array_map(function ($value) {
            return trim($value);
        }, $names));

        $artists = $this->findBy([
            'name' => $names,
            'site' => $site,
        ]);

        $found = [];
        foreach ($artists as $artist) {
            $found[] = $artist->getName();
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
