<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Doctrine\ORM\Mapping\ClassMetadata;

class NameOrExpandedNameOperatorType extends \Ecodev\Felix\Api\Input\Operator\SearchOperatorType
{
    protected function getSearchableFieldsWhitelist(ClassMetadata $metadata): array
    {
        return ['name', 'expandedName'];
    }

    protected function getSearchableJoinedEntities(): array
    {
        return [];
    }
}
