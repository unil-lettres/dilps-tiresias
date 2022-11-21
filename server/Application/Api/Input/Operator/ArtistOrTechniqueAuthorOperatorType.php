<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Application\Model\Artist;
use Application\Model\Card;
use Doctrine\ORM\Mapping\ClassMetadata;
use Ecodev\Felix\Api\Exception;

class ArtistOrTechniqueAuthorOperatorType extends \Ecodev\Felix\Api\Input\Operator\SearchOperatorType
{
    protected function getSearchableFieldsWhitelist(ClassMetadata $metadata): array
    {
        if ($metadata->getName() === Card::class) {
            return ['techniqueAuthor', 'cachedArtistNames'];
        }

        if ($metadata->getName() === Artist::class) {
            return ['name'];
        }

        throw new Exception('Unsupported type of object for ArtistOrTechniqueAuthor');
    }

    protected function getSearchableJoinedEntities(): array
    {
        return [];
    }
}
