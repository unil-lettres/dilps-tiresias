#! /usr/bin/env php
<?php

/**
 * A script to update image size data in DB from file on disk
 */
use Application\Model\Card;
use Application\Repository\CardRepository;
use Imagine\Image\ImagineInterface;

require_once 'server/cli.php';

global $container;

/** @var ImagineInterface $imagine */
$imagine = $container->get(ImagineInterface::class);

if ($argc > 1) {
    parse_str(implode('&', array_slice($argv, 1)), $_GET);
}

// If a "site" parameter is available, it will be used to filter the records to update.
$site = $_GET['site'] ?? null;

$connection = _em()->getConnection();
/** @var CardRepository $cardRepository */
$cardRepository = _em()->getRepository(Card::class);
$filesInDb = $cardRepository->getFilenamesForDimensionUpdate($site);
$count = 0;
$total = count($filesInDb);
foreach ($filesInDb as $i => $card) {
    if ($i === 0 || $i % 500 === 0) {
        echo $i . '/' . $total . PHP_EOL;
    }

    if (!file_exists($card['filename'])) {
        continue;
    }

    try {
        $image = $imagine->open($card['filename']);
        $size = $image->getSize();

        // To force clearing the cache of Imagick
        unset($image);

        $width = $size->getWidth();
        $height = $size->getHeight();

        if ($width !== (int) $card['width'] || $height !== (int) $card['height']) {
            $count += $connection->update('card', ['width' => $width, 'height' => $height], ['id' => $card['id']]);
        }
    } catch (\Exception $e) {
        echo $card['filename'] . ' (' . $e->getMessage() . ")\n";
    }
}

echo '
Updated records in DB: ' . $count . '
';
