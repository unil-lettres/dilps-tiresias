<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\User;
use Application\Stream\TemporaryFile;
use Laminas\Diactoros\Response;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Server\MiddlewareInterface;

abstract class AbstractXlsx implements MiddlewareInterface
{
    protected function createSpreadsheet(string $site): Spreadsheet
    {
        $title = $site . '_' . date('c', time());
        $spreadsheet = new Spreadsheet();

        // Set a few meta data
        $properties = $spreadsheet->getProperties();
        $properties->setCreator(User::getCurrent() ? User::getCurrent()->getLogin() : '');
        $properties->setLastModifiedBy($site);
        $properties->setTitle($title);
        $properties->setSubject('Généré par le système ' . $site);
        $properties->setDescription("Certaines images sont soumises aux droits d'auteurs. Vous pouvez nous contactez à diatheque@unil.ch pour plus d'informations.");
        $properties->setKeywords('Université de Lausanne');

        return $spreadsheet;
    }

    protected function createResponse(Spreadsheet $spreadsheet): ResponseInterface
    {
        // Write to disk
        $tempFile = tempnam('data/tmp/', 'xlsx');

        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);

        $headers = [
            'content-type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'content-length' => filesize($tempFile),
            'content-disposition' => 'inline; filename="' . $spreadsheet->getProperties()->getTitle() . '.xlsx"',
        ];

        $stream = new TemporaryFile($tempFile);
        $response = new Response($stream, 200, $headers);

        return $response;
    }
}
