<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator\CardYearRange;

final class GreaterOperatorType extends AbstractOperatorType
{
    protected function getSqlCondition(string $param): string
    {
        return "SELECT id FROM card WHERE IF(
            card.to IS NOT NULL,
            card.to > $param,
            card.from > $param
        )";
    }
}
