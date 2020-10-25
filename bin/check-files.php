#! /usr/bin/env php
<?php

/**
 * A script to show missing files on disk and non-needed files on disk
 *
 * It is up to the user to then take appropriate action based on that information.
 */
use Application\Model\Card;
use Application\Repository\CardRepository;
use Application\Utility;

require_once __DIR__ . '/../htdocs/index.php';

/** @var CardRepository $cardRepository */
$cardRepository = _em()->getRepository(Card::class);
$filesInDb = $cardRepository->getFilenames();
$filesOnDisk = glob('data/images/*');

$missingFiles = array_diff($filesInDb, $filesOnDisk);
$unneededFiles = array_diff($filesOnDisk, $filesInDb);

Utility::printFiles('List of missing files on disk:', $missingFiles);
Utility::printFiles('List of unneeded files on disk:', $unneededFiles);

echo '
Total files in DB     : ' . count($filesInDb) . '
Total files on disk   : ' . count($filesOnDisk) . '
Missing files on disk : ' . count($missingFiles) . '
Unneeded files on disk: ' . count($unneededFiles) . '
';
