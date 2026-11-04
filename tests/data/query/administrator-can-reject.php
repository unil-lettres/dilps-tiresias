<?php

declare(strict_types=1);

use Doctrine\DBAL\Connection;
use PHPUnit\Framework\Assert;

return [
    [
        'query' => 'mutation {
            r1: rejectChange(id: 7000)

            r2: rejectChange(id: 7001)

            r3: rejectChange(id: 7002)
        }',
    ],
    [
        'data' => [
            'r1' => true,
            'r2' => true,
            'r3' => true,
        ],
    ],
    null,
    function (Connection $connection): void {
        $cards = $connection->fetchFirstColumn('SELECT id FROM card WHERE id IN (6000, 6001, 6002) ORDER BY id');

        // The card suggested for creation, and the card suggested for deletion, still exist. But the copy of the card
        // suggesting to update it was deleted with the rejected suggestion
        Assert::assertSame([6000, 6001], $cards);
    },
];
