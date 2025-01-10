#! /usr/bin/env php
<?php

/**
 * Script to migrate the card.dilps_domain column to the domain table.
 */

declare(strict_types=1);

require_once 'server/cli.php';

$connection = _em()->getConnection();

// Check for CSV transformation file argument.
if ($argc < 3) {
    echo "Usage: php bin/oneshot/migrate-dilps-domain.php <path_to_csv_transformation_file> <creator_id>\n";
    exit(1);
}

$csvFile = $argv[1];
if (!file_exists($csvFile)) {
    echo "Error: CSV file '$csvFile' not found.\n";
    exit(1);
}

$creatorId = $argv[2];
if (!is_numeric($creatorId)) {
    echo "Error: Creator ID must be a number.\n";
    exit(1);
}

// Load external CSV for domain transformations.
$domainMap = [];
if (($handle = fopen($csvFile, 'rb')) !== false) {
    while (($data = fgetcsv($handle, null, ';')) !== false) {
        $finalName = trim($data[0]);
        $aliases = array_map('trim', explode(',', $data[1]));
        foreach ($aliases as $alias) {
            $domainMap[$alias] = $finalName;
            echo "Mapping domain: $alias -> $finalName\n";
        }

        // Add the final name to the map as well.
        // This is to filter which domain names are never mapped.
        $domainMap[$finalName] = $finalName;
        echo "Mapping domain: $finalName -> $finalName\n";
    }
    fclose($handle);
}

echo "Loaded domain transformations from CSV: $csvFile\n";

$sqlSelect = <<<SQL
        SELECT
            card.id AS card_id,
            card.dilps_domain
        FROM card
        WHERE TRUE
            AND card.dilps_domain IS NOT NULL
            AND card.dilps_domain != ''
            AND site = 'dilps'
    SQL;

$results = $connection->executeQuery($sqlSelect)->fetchAllAssociative();

$totalDomainsAdded = 0;
$totalCardDomainsAdded = 0;
$domainNotMapped = [];

echo "Processing cards...\n";
echo "Card ID, Domain ID, New domain name, Old domain name\n";

foreach ($results as $result) {
    $cardId = $result['card_id'];
    $domains = array_map('trim', explode(',', $result['dilps_domain']));

    foreach ($domains as $initialDomain) {
        if (empty($initialDomain)) {
            continue;
        }

        // Transform domain name if it exists in the CSV map.
        if (array_key_exists($initialDomain, $domainMap)) {
            $domainName = $domainMap[$initialDomain];
        } else {
            $domainName = $initialDomain;

            // Keep trace of domains that are not mapped for logs.
            if (!array_key_exists($initialDomain, $domainNotMapped)) {
                $domainNotMapped[$initialDomain] = [];
            }
            $domainNotMapped[$initialDomain][] = $cardId;
        }

        // Check if domain already exists in the domain table.
        $sqlCheckDomain = "SELECT id FROM domain WHERE name = :name AND site = 'dilps'";
        $existingDomain = $connection->fetchOne($sqlCheckDomain, [
            'name' => $domainName,
        ]);

        if (!$existingDomain) {
            // Insert new domain into domain table.
            $sqlInsertDomain = <<<SQL
                    INSERT INTO
                    domain (name, creator_id, owner_id, updater_id, site, creation_date, update_date)
                    VALUES (:name, :creator_id, :creator_id, :creator_id, 'dilps', NOW(), NOW())
                SQL;

            $connection->executeStatement(
                $sqlInsertDomain,
                [
                    'name' => $domainName,
                    'creator_id' => $creatorId,
                ],
            );

            $existingDomain = $connection->lastInsertId();
            ++$totalDomainsAdded;
        }

        // Insert into card_domain table if not already exists.
        // It could already exists if dilps_domain = "Gravure, Estampe"
        // and the mapping file as "Gravure / Estampe;Gravure,Estampe".
        $sqlCheckCardDomain = 'SELECT 1 FROM card_domain WHERE card_id = :card_id AND domain_id = :domain_id';
        $existingCardDomain = $connection->fetchOne($sqlCheckCardDomain, [
            'card_id' => $cardId,
            'domain_id' => $existingDomain,
        ]);
        if ($existingCardDomain) {
            echo "Card $cardId already has domain $existingDomain.\n";

            continue;
        }
        $sqlInsertCardDomain = 'INSERT INTO card_domain (card_id, domain_id) VALUES (:card_id, :domain_id)';
        $connection->executeStatement($sqlInsertCardDomain, [
            'card_id' => $cardId,
            'domain_id' => $existingDomain,
        ]);
        ++$totalCardDomainsAdded;

        // Log domains that was transformed.
        if ($domainName !== $initialDomain) {
            echo "$cardId, $existingDomain, $domainName, $initialDomain\n";
        }
    }
}

echo "\nDomains not mapped\n";
foreach ($domainNotMapped as $domain => $card_id) {
    echo "$domain: " . implode(', ', $card_id) . "\n";
}

echo "\nProcessing complete.\n";
echo "Total new domains added: $totalDomainsAdded\n";
echo "Total card-domain relationships added: $totalCardDomainsAdded\n";
