<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator;

use Application\Model\Card;
use Application\Model\Institution;
use Doctrine\ORM\Mapping\ClassMetadata;
use Ecodev\Felix\Api\Exception;

class LocalityOrInstitutionLocalityOperatorType extends \Ecodev\Felix\Api\Input\Operator\SearchOperatorType
{
    protected function getSearchableFieldsWhitelist(ClassMetadata $metadata): array
    {
        if ($metadata->getName() === Card::class) {
            return ['locality'];
        }

        if ($metadata->getName() === Institution::class) {
            return ['locality'];
        }

        throw new Exception('Unsupported type of object for LocalityOrInstitutionLocality');
    }

    protected function getSearchableJoinedEntities(): array
    {
        return [
            Card::class => ['institution'],
        ];
    }
}
