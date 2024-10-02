#! /usr/bin/env php
<?php

/**
 * This one time use script will fix the field `card.plain_name` not being
 * filled in since the bug introduced in ed5df283ec3ce40c806d6b66753d19a49b509d13.
 *
 * For each cards that do not have a `plain_name` but have a `name`, it will
 * fill the `plain_name` with the plain text version of the `name`.
 */

declare(strict_types=1);

use Application\Utility;

require_once 'server/cli.php';

// We don't use CardRepository because we don't want Doctrine to update timestamps.

$connection = _em()->getConnection();

$sqlSelect = <<<SQL
        SELECT
            card.id,
            card.name
        FROM card
        WHERE TRUE
            AND plain_name = ''
            AND name != ''
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
    $plainName = Utility::richTextToPlainText($result['name']);
    $count = $connection->executeStatement(
        $sqlUpdate,
        [
            'id' => $result['id'],
            'plainName' => $plainName,
        ],
    );

    if ($count === 1) {
        echo "Card id {$result['id']} updated. name: {$result['name']}, plain name: $plainName\n";
        ++$total;
    } else {
        echo "Card id {$result['id']} failed to update.\n";
        ++$totalFailed;
    }
}

echo "Total cards updated: $total\n";
echo "Total cards failed to update: $totalFailed\n";
