<?php

declare(strict_types=1);

namespace Application\Handler;

use Application\Repository\CardRepository;
use Application\Service\ImageResizer;
use Ecodev\Felix\Handler\AbstractHandler;
use Laminas\Diactoros\Response;
use Laminas\Diactoros\Response\RedirectResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ImageHandler extends AbstractHandler
{
    public function __construct(
        private readonly CardRepository $cardRepository,
        private readonly ImageResizer $imageResizer,
    ) {}

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

            // Use cache directory instead of tmp directory for standard sizes.
            // Standard sizes are maxHeight 300px or 2000px. Note that if the
            // original image height is smaller than 2000px, the maxHeight will
            // be normalized to the original image height, and thus be
            // considered as a standard size.
            $normalizedHeight = min($maxHeight, $card->getHeight());
            $useCacheDir = false
                || $normalizedHeight === 300
                || $normalizedHeight === 2000
                || ($card->getHeight() === $normalizedHeight && $normalizedHeight < 2000);

            $resizeNeeded = $this->imageResizer->isResizeNeeded($card, $maxHeight, $useWebp);
            $resizeSpecified = array_key_exists('resize', $request->getQueryParams());

            if ($resizeNeeded && !$resizeSpecified) {
                // If resize is needed, user must specify a specific query params.
                // This allow to configure server load balance, but also work
                // without any special configuration if not needed.
                // Resizing operation is ressource intensive and could lead to block
                // the server if not properly configured.
                return new RedirectResponse($this->constructRedirectURI(), 302);
            }

            $path = $this->imageResizer->resize($card, $maxHeight, $useWebp, !$useCacheDir);
        }

        $queryParams = $request->getQueryParams();

        $resource = fopen($path, 'rb');
        $type = mime_content_type($path);
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $filename = $id . '.' . $extension;
        $disposition = isset($queryParams['inline']) ? 'inline' : 'attachment';

        $isTmp = str_contains($path, ImageResizer::TMP_IMAGE_PATH);
        $cacheControl = $isTmp ? 'no-cache' : 'max-age=' . (24 * 60 * 60);

        return new Response($resource, 200, [
            'content-type' => $type,
            'content-disposition' => $disposition . '; filename=' . $filename,
            'cache-control' => $cacheControl,
        ]);
    }

    /**
     * Construct a new URI for the current request with the resize query
     * parameter set to true.
     */
    protected function constructRedirectURI(): string
    {
        $currentUrl = $_SERVER['REQUEST_URI'];
        $queryString = $_SERVER['QUERY_STRING'];

        // Build the new query string
        parse_str($queryString, $queryArray);
        $queryArray['resize'] = 'true';
        $newQueryString = http_build_query($queryArray);

        // Reconstruct the URL with the new query string
        $baseUrl = strtok($currentUrl, '?');

        return $baseUrl . '?' . $newQueryString;
    }
}
