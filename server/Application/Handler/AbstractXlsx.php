<?php

declare(strict_types=1);

namespace Application\Handler;

use Application\Model\User;
use Application\Stream\TemporaryFile;
use Laminas\Diactoros\Response;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Server\RequestHandlerInterface;

abstract class AbstractXlsx implements RequestHandlerInterface
{
}
