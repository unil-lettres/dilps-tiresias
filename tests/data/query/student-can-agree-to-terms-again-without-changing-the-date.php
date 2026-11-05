<?php

declare(strict_types=1);

use Application\Model\User;
use Doctrine\DBAL\Connection;

return [
    [
        'query' => 'mutation {
            updateUser(id: 1003, input: {termsAgreement: "2000-01-01T00:00:00+01:00"}) {
                id
            }
        }',
    ],
    [
        'data' => [
            'updateUser' => [
                'id' => '1003',
            ],
        ],
    ],
    // student (1003) already agreed
    function (Connection $connection): void {
        $connection->executeStatement("UPDATE user SET terms_agreement = '2026-01-01 00:00:00' WHERE id = 1003");

        // The current user is already loaded, so it must see the change too
        _em()->refresh(User::getCurrent());
    },
    // the first agreement is kept, neither backdated nor moved to now
    function (Connection $connection): void {
        $date = $connection->fetchOne('SELECT terms_agreement FROM user WHERE id = 1003');
        PHPUnit\Framework\Assert::assertSame('2026-01-01 00:00:00', $date);
    },
];
