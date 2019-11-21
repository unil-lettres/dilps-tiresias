<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator\DatingYearRange;

final class EqualOperatorType extends AbstractOperatorType
{
    protected function getInternalDqlCondition(string $datingAlias): string
    {
        $from = $this->createParam();
        $to = $this->createParam(true);

        return $datingAlias . '.from <= ' . $from . ' AND ' . $to . ' <= ' . $datingAlias . '.to';
    }
}
