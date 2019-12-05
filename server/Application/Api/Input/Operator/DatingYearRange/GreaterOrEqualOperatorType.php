<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator\DatingYearRange;

final class GreaterOrEqualOperatorType extends AbstractOperatorType
{
    protected function getInternalDqlCondition(string $datingAlias): string
    {
        $value = $this->createParam();

        return $datingAlias . '.to >= ' . $value;
    }
}
