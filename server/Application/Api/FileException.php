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
        $message = 'Le fichier « ' . $file->getClientFilename() . " » n'a pas pu être enregistré";

        // Only show the reason if it was written for the end-user, otherwise it could expose internals, eg: a path on the server
        if ($previous instanceof \Ecodev\Felix\Api\Exception) {
            $message .= ' : ' . $previous->getMessage();
        } else {
            $message .= '.';
        }

        parent::__construct($message, 0, $previous);
    }
}
