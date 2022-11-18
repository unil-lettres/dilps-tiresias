<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Application\Model\Artist;
use Application\Model\Card;
use Application\Model\Country;
use Application\Model\Institution;
use Doctrine\ORM\Mapping\ClassMetadata;

class SearchOperatorType extends \Ecodev\Felix\Api\Input\Operator\SearchOperatorType
{
    protected function getSearchableFieldsWhitelist(ClassMetadata $metadata): array
    {
        if (in_array($metadata->getName(), [Institution::class, Artist::class, Country::class], true)) {
            return ['name'];
        }

        return [
            'name',
            'expandedName',
            'street',
            'locality',
            'country',
            'material',
            'dilpsDomain',
            'addition',
            'login',
            'email',
            'dating',
            'id',
            'code',
            'objectReference',
            'corpus',
        ];
    }

    protected function getSearchableJoinedEntities(): array
    {
        return [
            Card::class => ['institution', 'artists', 'country'],
        ];
    }
}
