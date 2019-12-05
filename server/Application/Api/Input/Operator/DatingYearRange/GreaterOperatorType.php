<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator\DatingYearRange;

final class GreaterOperatorType extends AbstractOperatorType
{
    protected function getInternalDqlCondition(string $datingAlias): string
    {
        $value = $this->createParam(true);

        return $datingAlias . '.to > ' . $value;
    }
}
