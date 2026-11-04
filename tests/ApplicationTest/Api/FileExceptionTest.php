<?php

declare(strict_types=1);

namespace ApplicationTest\Api;

use Application\Api\FileException;
use Ecodev\Felix\Api\Exception;
use Laminas\Diactoros\Stream;
use Laminas\Diactoros\UploadedFile;
use PHPUnit\Framework\TestCase;
use RuntimeException;

class FileExceptionTest extends TestCase
{
    public function testShowOnlyReasonsWrittenForEndUsers(): void
    {
        $file = new UploadedFile(new Stream('php://memory'), 0, UPLOAD_ERR_OK, 'image.jpg');

        $userFacing = new FileException($file, new Exception("Le type de fichier « text/plain » n'est pas accepté."));
        self::assertSame("Le fichier « image.jpg » n'a pas pu être enregistré : Le type de fichier « text/plain » n'est pas accepté.", $userFacing->getMessage());

        $internal = new FileException($file, new RuntimeException('Could not get mimetype for path: /var/www/data/images/foo.jpg'));
        self::assertSame("Le fichier « image.jpg » n'a pas pu être enregistré.", $internal->getMessage(), 'must not expose the path on the server');
    }
}
