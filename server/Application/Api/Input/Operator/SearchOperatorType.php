<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Application\Model\Artist;
use Application\Model\Card;
use Application\Model\Country;
use Application\Model\Domain;
use Application\Model\Institution;
use Doctrine\ORM\Mapping\ClassMetadata;

class SearchOperatorType extends AbstractSearchOperatorType
{
    protected function getSearchableFieldsWhitelist(ClassMetadata $metadata): array
    {
        if (
            in_array(
                $metadata->getName(),
                [
                    Domain::class,
                    Institution::class,
                    Artist::class,
                    Country::class,
                ],
                true
            )
        ) {
            return ['name'];
        }

        return [
            'name',
            'expandedName',
            'cachedArtistNames',
            'street',
            'locality',
            'country',
            'material',
            'addition',
            'login',
            'email',
            'dating',
            'id',
            'code',
            'objectReference',
            'corpus',
            'techniqueAuthor',
        ];
    }

    protected function getSearchableJoinedEntities(): array
    {
        return [
            Card::class => ['institution', 'country', 'domains'],
        ];
    }
}
