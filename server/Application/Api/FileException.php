<?php

declare(strict_types=1);

namespace Application\Api;

use Psr\Http\Message\UploadedFileInterface;
use Throwable;

/**
 * Exception when something goes wrong with a file upload.
 */
class FileException extends \Ecodev\Felix\Api\Exception
{
    public function __construct(UploadedFileInterface $file, Throwable $previous)
    {
        $message = 'Erreur avec le fichier "' . $file->getClientFilename() . '" : ' . $previous->getMessage();

        parent::__construct($message, 0, $previous);
    }
}
