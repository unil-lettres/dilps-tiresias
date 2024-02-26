<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Doctrine\ORM\Mapping\ClassMetadata;

class NameOrExpandedNameOperatorType extends AbstractSearchOperatorType
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
