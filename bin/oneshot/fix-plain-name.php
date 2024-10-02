#! /usr/bin/env php
<?php

/**
 * This one time use script will fix the field `card.plain_name` not being
 * filled in nor updated since the bug introduced in
 * ed5df283ec3ce40c806d6b66753d19a49b509d13 in v4.2.0 on 2024.04.09.
 *
 * We will only fix data since this bug was introduced. Because it seems that
 * there was a lot of changes in policies of how HTML tags are stripped from
 * name and how plain_name was generated and data have never been updated
 * accordingly.
 *
 * So we can't just check if plain_name !== what plain_name should
 * be, because it might have been generated correctly at the time but is no
 * longer correct now.
 *
 * So for the sake of not changing that was not changed before, we will only fix
 * data that was affected by this bug.
 */

declare(strict_types=1);

use Application\Utility;

require_once 'server/cli.php';

// We don't use CardRepository because we don't want Doctrine to update timestamps.

$connection = _em()->getConnection();

$sqlSelect = <<<SQL
        SELECT
            card.id,
            card.plain_name,
            card.name
        FROM card
        WHERE card.update_date >= '2024-04-09 00:00:00'
    SQL;
$results = $connection->executeQuery($sqlSelect)->fetchAllAssociative();

$total = 0;
$totalFailed = 0;

$sqlUpdate = <<<SQL
        UPDATE card
        SET plain_name = :plainName
        WHERE id = :id
    SQL;

foreach ($results as $result) {
    $fixedPlainName = Utility::richTextToPlainText($result['name']);

    if ($fixedPlainName !== $result['plain_name']) {
        $count = $connection->executeStatement(
            $sqlUpdate,
            [
                'id' => $result['id'],
                'plainName' => $fixedPlainName,
            ],
        );

        if ($count === 1) {
            echo "Card id {$result['id']} updated.\n    Name: {$result['name']}\n    Old plain name: {$result['plain_name']}\n    New plain name: $fixedPlainName\n\n";
            ++$total;
        } else {
            echo "Card id {$result['id']} failed to update.\n";
            ++$totalFailed;
        }
    }
}

echo "Total cards updated: $total\n";
echo "Total cards failed to update: $totalFailed\n";
