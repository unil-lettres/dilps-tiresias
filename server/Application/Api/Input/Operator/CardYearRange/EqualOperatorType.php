<?php

declare(strict_types=1);

namespace Application\Api\Input\Operator\CardYearRange;

final class EqualOperatorType extends AbstractOperatorType
{
    protected function getSqlCondition(string $param): string
    {
        return "SELECT id FROM card WHERE IF(
            card.from IS NOT NULL AND card.to IS NOT NULL,
            (card.from <= $param AND $param <= card.to),
            IF(
                card.from IS NOT NULL,
                card.from = $param,
                card.to = $param
            )
        )";
    }
}
