<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator\DatingYearRange;

final class LessOperatorType extends AbstractOperatorType
{
    protected function getInternalDqlCondition(string $datingAlias): string
    {
        $value = $this->createParam();

        return $datingAlias . '.from < ' . $value;
    }
}
