<?php

declare(strict_types=1);

namespace Application\Handler;

use Application\Repository\CardRepository;
use Application\Service\ImageResizer;
use Ecodev\Felix\Handler\AbstractHandler;
use Laminas\Diactoros\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ImageHandler extends AbstractHandler
{
    public function __construct(
        private readonly CardRepository $cardRepository,
        private readonly ImageResizer $imageResizer,
    ) {
    }

    /**
     * Serve an image from disk, with optional dynamic resizing.
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $id = $request->getAttribute('id');

        $card = $this->cardRepository->findOneById($id);
        if (!$card) {
            return $this->createError("Card $id not found in database");
        }

        $path = $card->getPath();
        if (!is_readable($path)) {
            return $this->createError("Image for card $id not found on disk, or not readable");
        }

        $maxHeight = (int) $request->getAttribute('maxHeight');
        if ($maxHeight) {
            $accept = $request->getHeaderLine('accept');
            $useWebp = str_contains($accept, 'image/webp');

            $path = $this->imageResizer->resize($card, $maxHeight, $useWebp);
        }

        $queryParams = $request->getQueryParams();

        $resource = fopen($path, 'rb');
        $type = mime_content_type($path);
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $filename = $id . '.' . $extension;
        $disposition = isset($queryParams['inline']) ? 'inline' : 'attachment';

        $response = new Response($resource, 200, [
            'content-type' => $type,
            'content-disposition' => $disposition . '; filename=' . $filename,
            'cache-control' => 'max-age=' . (24 * 60 * 60), // 24 hours cache
        ]);

        return $response;
    }
}
